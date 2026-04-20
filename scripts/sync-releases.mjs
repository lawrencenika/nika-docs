#!/usr/bin/env node
// Generates Mintlify <Update> MDX pages from GitHub Releases.
//
// Config: scripts/changelog-sources.json — an array of entries:
//   { repo, outputPath, title, description, includePrereleases }
//
// Usage:
//   node scripts/sync-releases.mjs              # sync every entry
//   node scripts/sync-releases.mjs owner/repo   # sync only the matching entry
//
// Env:
//   GITHUB_TOKEN          Optional; raises API rate limit and allows private repos.
//   GH_RELEASES_TOKEN     Overrides GITHUB_TOKEN if set (use for private source repos).
//
// Source-repo side: in each source repo, add a workflow that on `release: published`
// triggers a repository_dispatch on this docs repo, e.g.:
//   gh api /repos/<docs-owner>/nika-docs/dispatches \
//     -f event_type=release-published \
//     -f 'client_payload[repo]=<owner>/<repo>'

import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const configPath = resolve(__dirname, "changelog-sources.json");

const token = process.env.GH_RELEASES_TOKEN || process.env.GITHUB_TOKEN;
const filter = process.argv[2];

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "nika-docs-release-sync",
};
if (token) headers.Authorization = `Bearer ${token}`;

async function fetchAllReleases(repo) {
  const all = [];
  for (let page = 1; page < 20; page++) {
    const url = `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`GitHub API ${res.status} for ${repo}: ${body}`);
    }
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const SEVERITY_TO_COMPONENT = {
  info: "Tip",
  warning: "Warning",
  error: "Error",
};

async function fetchReleaseMetadata(release) {
  const asset = (release.assets || []).find((a) => a.name === "release-metadata.json");
  if (!asset) return [];
  // For private repos, hit the API asset endpoint with octet-stream; for public, the
  // browser_download_url works without auth. We use the API route so one code path covers both.
  const res = await fetch(asset.url, {
    headers: { ...headers, Accept: "application/octet-stream" },
    redirect: "follow",
  });
  if (!res.ok) {
    console.warn(`  [warn] could not fetch release-metadata.json for ${release.tag_name}: ${res.status}`);
    return [];
  }
  try {
    const parsed = JSON.parse(await res.text());
    const messages = parsed["messages"]
    return Array.isArray(messages) ? messages : [messages];
  } catch (err) {
    console.warn(`  [warn] release-metadata.json for ${release.tag_name} is not valid JSON: ${err.message}`);
    return [];
  }
}

function renderNotice(notice) {
  const component = SEVERITY_TO_COMPONENT[notice.severity] || "Note";
  const lines = [];
  if (notice.title) lines.push(`**${notice.title}**`, "");
  if (notice.body) lines.push(notice.body);
  if (notice.show_if_version_lt) {
    lines.push("", `_Applies when upgrading to version ${notice.show_if_version_lt}._`);
  }
  return `<${component}>\n${lines.join("\n")}\n</${component}>`;
}

async function renderPage(entry, releases) {
  const { title, description } = entry;
  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${(description || "").replace(/"/g, '\\"')}"`,
    "rss: true",
    "---",
    "",
    "{/* AUTO-GENERATED from GitHub Releases by scripts/sync-releases.mjs — do not edit by hand. */}",
    "",
  ].join("\n");

  if (releases.length === 0) {
    return frontmatter + "\n_No releases have been published yet._\n";
  }

  const blocks = await Promise.all(
    releases.map(async (r) => {
      const label = formatDate(r.published_at || r.created_at);
      const version = r.tag_name || r.name || "";
      const heading =
        r.name && r.name.trim() && r.name.trim() !== (r.tag_name || "").trim()
          ? `## ${r.name.trim()}\n\n`
          : "";
      const body = (r.body || "").trim() || "_No release notes provided._";

      const notices = await fetchReleaseMetadata(r);
      const noticeBlocks = notices.map(renderNotice).filter(Boolean);
      const noticesSection = noticeBlocks.length ? `\n\n${noticeBlocks.join("\n\n")}` : "";

      return `<Update label="${label}" description="${version.replace(/"/g, '\\"')}">\n${heading}${body}${noticesSection}\n</Update>`;
    })
  );

  return frontmatter + "\n" + blocks.join("\n\n") + "\n";
}

async function writeAtomic(absPath, content) {
  await mkdir(dirname(absPath), { recursive: true });
  const tmp = `${absPath}.tmp-${process.pid}`;
  await writeFile(tmp, content, "utf8");
  await rename(tmp, absPath);
}

async function syncEntry(entry) {
  if (!entry.repo || entry.repo.includes("<OWNER>")) {
    console.warn(`[skip] ${entry.outputPath}: repo slug not set (${entry.repo})`);
    return;
  }
  console.log(`[sync] ${entry.repo} -> ${entry.outputPath}`);
  const raw = await fetchAllReleases(entry.repo);
  const filtered = raw
    .filter((r) => !r.draft)
    .filter((r) => entry.includePrereleases || !r.prerelease)
    .sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));

  const mdx = await renderPage(entry, filtered);
  const absPath = resolve(repoRoot, entry.outputPath);
  await writeAtomic(absPath, mdx);
  console.log(`  wrote ${filtered.length} release(s)`);
}

async function main() {
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const entries = filter ? config.filter((e) => e.repo === filter) : config;
  if (entries.length === 0) {
    console.warn(`No entries matched filter "${filter}"`);
    return;
  }
  for (const entry of entries) {
    try {
      await syncEntry(entry);
    } catch (err) {
      console.error(`[error] ${entry.repo}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
