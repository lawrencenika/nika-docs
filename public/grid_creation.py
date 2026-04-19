import argparse
import geopandas as gpd
import pandas as pd
import numpy as np
from shapely.geometry import Polygon, box
from shapely import affinity
from pathlib import Path


def create_grid(input_file, 
                cell_size, 
                output_file,
                grid_type='square',
                buffer=0,
                clip_to_extent=False,
                add_id=True,
                rotation=0,
                auto_reproject=True,
                output_dir="/data/"):
    """
    Create a grid based on input vector extent
    
    Parameters:
    -----------
    input_file : str
        Input vector file to get extent from
    cell_size : float or tuple
        Grid cell size in CRS units
        - For projected CRS (meters): use meters (e.g., 1000)
        - For geographic CRS (degrees): use degrees (e.g., 0.01) 
          OR set auto_reproject=True to use meters
    output_file : str
        Output filename (without extension)
    grid_type : str
        Grid type options:
        - 'square' : Square cells
        - 'rectangle' : Rectangular cells (requires tuple cell_size)
        - 'hexagon' : Hexagonal cells (flat-top)
        - 'hexagon_pointy' : Hexagonal cells (pointy-top)
        - 'triangle' : Triangular cells
        - 'diamond' : Diamond/rhombus cells
    buffer : float
        Buffer around extent in CRS units (default: 0)
    clip_to_extent : bool
        If True, remove cells outside input geometry (default: False)
    add_id : bool
        Add unique ID to each cell (default: True)
    rotation : float
        Rotation angle in degrees (for square/rectangle/diamond)
    auto_reproject : bool
        If True, automatically reproject geographic CRS to UTM (default: True)
    output_dir : str
        Output directory path
    
    Returns:
    --------
    str : Path to output grid file
    """
    
    print(f"Loading {input_file}...")
    gdf = gpd.read_file(input_file)
    
    print(f"Input CRS: {gdf.crs}")
    print(f"Features: {len(gdf)}")
    
    original_crs = gdf.crs
    
    # Check if CRS is geographic and cell_size seems large
    if gdf.crs and gdf.crs.is_geographic:
        if isinstance(cell_size, (int, float)) and cell_size > 1:
            print(f"\n⚠️  WARNING: Your CRS is geographic (degrees)")
            print(f"   Cell size {cell_size} degrees = ~{cell_size * 111000:.0f}m at equator!")
            
            if auto_reproject:
                print(f"\n   Auto-reprojecting to UTM for grid creation...")
                target_crs = _auto_detect_utm(gdf)
                print(f"   Detected UTM: {target_crs}")
                gdf = gdf.to_crs(target_crs)
                print(f"   Now using cell_size={cell_size} meters\n")
            else:
                print(f"\n   Options:")
                print(f"   1. Use smaller cell_size (e.g., 0.001 = ~111m)")
                print(f"   2. Set auto_reproject=True to use meters")
                print(f"   Proceeding with {cell_size} degrees...\n")
        elif isinstance(cell_size, tuple) and max(cell_size) > 1:
            print(f"\n⚠️  WARNING: Geographic CRS with large cell size")
            if auto_reproject:
                target_crs = _auto_detect_utm(gdf)
                print(f"   Auto-reprojecting to {target_crs}")
                gdf = gdf.to_crs(target_crs)
    
    # Get bounds
    minx, miny, maxx, maxy = gdf.total_bounds
    
    # Add buffer
    if buffer > 0:
        minx -= buffer
        miny -= buffer
        maxx += buffer
        maxy += buffer
        print(f"Added {buffer} unit buffer")
    
    # Handle cell size
    if isinstance(cell_size, (int, float)):
        cell_width = cell_height = cell_size
    else:
        cell_width, cell_height = cell_size
    
    print(f"Creating '{grid_type}' grid...")
    print(f"  Extent: ({minx:.2f}, {miny:.2f}) to ({maxx:.2f}, {maxy:.2f})")
    print(f"  Cell size: {cell_width} x {cell_height}")
    
    # Create grid based on type
    if grid_type == 'square':
        grid_cells = _create_square_grid(minx, miny, maxx, maxy, cell_width, cell_height, rotation)
    
    elif grid_type == 'rectangle':
        if isinstance(cell_size, (int, float)):
            raise ValueError("Rectangle grid requires tuple cell_size=(width, height)")
        grid_cells = _create_square_grid(minx, miny, maxx, maxy, cell_width, cell_height, rotation)
    
    elif grid_type == 'hexagon':
        grid_cells = _create_hexagon_grid(minx, miny, maxx, maxy, cell_width, orientation='flat')
    
    elif grid_type == 'hexagon_pointy':
        grid_cells = _create_hexagon_grid(minx, miny, maxx, maxy, cell_width, orientation='pointy')
    
    elif grid_type == 'triangle':
        grid_cells = _create_triangle_grid(minx, miny, maxx, maxy, cell_width)
    
    elif grid_type == 'diamond':
        grid_cells = _create_diamond_grid(minx, miny, maxx, maxy, cell_width)
    
    else:
        raise ValueError(
            f"Unknown grid_type: {grid_type}. "
            f"Options: 'square', 'rectangle', 'hexagon', 'hexagon_pointy', "
            f"'triangle', 'diamond'"
        )
    
    # Create GeoDataFrame
    grid_gdf = gpd.GeoDataFrame(geometry=grid_cells, crs=gdf.crs)
    
    # Add unique ID
    if add_id:
        grid_gdf['grid_id'] = range(1, len(grid_gdf) + 1)
    
    # Clip to input geometry if requested
    if clip_to_extent:
        print("Clipping to input geometry...")
        union_geom = gdf.geometry.unary_union
        grid_gdf = grid_gdf[grid_gdf.intersects(union_geom)]
        grid_gdf = grid_gdf.reset_index(drop=True)
        if add_id:
            grid_gdf['grid_id'] = range(1, len(grid_gdf) + 1)
    
    # Reproject back to original CRS if we auto-reprojected
    if auto_reproject and original_crs != grid_gdf.crs:
        print(f"Reprojecting grid back to original CRS: {original_crs}")
        grid_gdf = grid_gdf.to_crs(original_crs)
    
    # Save
    output_path = Path(output_dir) / f"{output_file}.geojson"
    grid_gdf.to_file(output_path, driver='GeoJSON')
    
    print(f"✓ Grid created: {output_path}")
    print(f"  Output CRS: {grid_gdf.crs}")
    print(f"  Total cells: {len(grid_gdf)}")
    if len(grid_cells) > 0:
        print(f"  Cell area: {grid_cells[0].area:.2f} square units")
    
    return str(output_path)


def create_grid_from_bounds(minx, miny, maxx, maxy,
                            cell_size,
                            output_file,
                            crs='EPSG:4326',
                            grid_type='square',
                            add_id=True,
                            rotation=0,
                            output_dir="/data/"):
    """
    Create grid from explicit bounds (no input file needed)
    
    Parameters:
    -----------
    minx, miny, maxx, maxy : float
        Bounding box coordinates
    cell_size : float or tuple
        Grid cell size
    output_file : str
        Output filename
    crs : str
        Coordinate reference system (default: 'EPSG:4326')
    grid_type : str
        Grid type: 'square', 'rectangle', 'hexagon', 'hexagon_pointy',
        'triangle', 'diamond'
    add_id : bool
        Add unique ID to each cell
    rotation : float
        Rotation angle in degrees (for square/rectangle/diamond)
    output_dir : str
        Output directory
    
    Returns:
    --------
    str : Path to output grid file
    """
    
    print(f"Creating '{grid_type}' grid from bounds...")
    print(f"  Extent: ({minx:.2f}, {miny:.2f}) to ({maxx:.2f}, {maxy:.2f})")
    
    # Handle cell size
    if isinstance(cell_size, (int, float)):
        cell_width = cell_height = cell_size
    else:
        cell_width, cell_height = cell_size
    
    print(f"  Cell size: {cell_width} x {cell_height}")
    
    # Create grid based on type
    if grid_type == 'square':
        grid_cells = _create_square_grid(minx, miny, maxx, maxy, cell_width, cell_height, rotation)
    
    elif grid_type == 'rectangle':
        if isinstance(cell_size, (int, float)):
            raise ValueError("Rectangle grid requires tuple cell_size=(width, height)")
        grid_cells = _create_square_grid(minx, miny, maxx, maxy, cell_width, cell_height, rotation)
    
    elif grid_type == 'hexagon':
        grid_cells = _create_hexagon_grid(minx, miny, maxx, maxy, cell_width, orientation='flat')
    
    elif grid_type == 'hexagon_pointy':
        grid_cells = _create_hexagon_grid(minx, miny, maxx, maxy, cell_width, orientation='pointy')
    
    elif grid_type == 'triangle':
        grid_cells = _create_triangle_grid(minx, miny, maxx, maxy, cell_width)
    
    elif grid_type == 'diamond':
        grid_cells = _create_diamond_grid(minx, miny, maxx, maxy, cell_width)
    
    else:
        raise ValueError(f"Unknown grid_type: {grid_type}")
    
    # Create GeoDataFrame
    grid_gdf = gpd.GeoDataFrame(geometry=grid_cells, crs=crs)
    
    if add_id:
        grid_gdf['grid_id'] = range(1, len(grid_gdf) + 1)
    
    # Save
    output_path = Path(output_dir) / f"{output_file}.geojson"
    grid_gdf.to_file(output_path, driver='GeoJSON')
    
    print(f"✓ Grid created: {output_path}")
    print(f"  Total cells: {len(grid_gdf)}")
    
    return str(output_path)


def _auto_detect_utm(gdf):
    """Automatically detect appropriate UTM zone for the data"""
    bounds = gdf.total_bounds
    lon = (bounds[0] + bounds[2]) / 2
    lat = (bounds[1] + bounds[3]) / 2
    
    # Calculate UTM zone
    utm_zone = int((lon + 180) / 6) + 1
    
    # Determine hemisphere
    hemisphere = 'north' if lat >= 0 else 'south'
    epsg_code = 32600 + utm_zone if hemisphere == 'north' else 32700 + utm_zone
    
    return f'EPSG:{epsg_code}'


def _create_square_grid(minx, miny, maxx, maxy, cell_width, cell_height, rotation=0):
    """Create square/rectangular grid cells with optional rotation"""
    
    # Calculate number of cells
    cols = int(np.ceil((maxx - minx) / cell_width))
    rows = int(np.ceil((maxy - miny) / cell_height))
    
    print(f"  Grid dimensions: {cols} columns x {rows} rows = {cols * rows} cells")
    
    cells = []
    for i in range(cols):
        for j in range(rows):
            # Calculate cell bounds
            cell_minx = minx + (i * cell_width)
            cell_miny = miny + (j * cell_height)
            cell_maxx = cell_minx + cell_width
            cell_maxy = cell_miny + cell_height
            
            # Create polygon
            cell = box(cell_minx, cell_miny, cell_maxx, cell_maxy)
            
            # Apply rotation if specified
            if rotation != 0:
                center_x = (cell_minx + cell_maxx) / 2
                center_y = (cell_miny + cell_maxy) / 2
                cell = affinity.rotate(cell, rotation, origin=(center_x, center_y))
            
            cells.append(cell)
    
    return cells


def _create_hexagon_grid(minx, miny, maxx, maxy, cell_size, orientation='flat'):
    """Create hexagonal grid cells
    
    Parameters:
    -----------
    orientation : str
        'flat' for flat-top hexagons (default)
        'pointy' for pointy-top hexagons
    """
    
    if orientation == 'flat':
        # Flat-top hexagon
        width = cell_size * 2
        height = cell_size * np.sqrt(3)
        horiz_spacing = width * 3/4
        vert_spacing = height
    else:  # pointy
        # Pointy-top hexagon
        width = cell_size * np.sqrt(3)
        height = cell_size * 2
        horiz_spacing = width
        vert_spacing = height * 3/4
    
    # Calculate number of cells
    cols = int(np.ceil((maxx - minx) / horiz_spacing)) + 1
    rows = int(np.ceil((maxy - miny) / vert_spacing)) + 1
    
    print(f"  Grid dimensions: ~{cols} x {rows} hexagons ({orientation}-top)")
    
    cells = []
    for col in range(cols):
        for row in range(rows):
            # Calculate hexagon center
            x = minx + col * horiz_spacing
            y = miny + row * vert_spacing
            
            # Offset every other column/row
            if orientation == 'flat' and col % 2 == 1:
                y += vert_spacing / 2
            elif orientation == 'pointy' and row % 2 == 1:
                x += horiz_spacing / 2
            
            # Create hexagon
            hexagon = _create_hexagon(x, y, cell_size, orientation)
            
            # Only include if within bounds
            if hexagon.intersects(box(minx, miny, maxx, maxy)):
                cells.append(hexagon)
    
    return cells


def _create_hexagon(center_x, center_y, size, orientation='flat'):
    """Create a single hexagon polygon"""
    if orientation == 'flat':
        # Flat-top hexagon
        angles = np.array([0, 60, 120, 180, 240, 300]) * np.pi / 180
    else:
        # Pointy-top hexagon (rotated 30 degrees)
        angles = np.array([30, 90, 150, 210, 270, 330]) * np.pi / 180
    
    hexagon_points = [
        (center_x + size * np.cos(angle), 
         center_y + size * np.sin(angle))
        for angle in angles
    ]
    hexagon_points.append(hexagon_points[0])  # Close the polygon
    
    return Polygon(hexagon_points)


def _create_triangle_grid(minx, miny, maxx, maxy, cell_size):
    """Create triangular grid cells"""
    
    # Triangle dimensions
    height = cell_size * np.sqrt(3) / 2
    
    cols = int(np.ceil((maxx - minx) / (cell_size / 2))) + 1
    rows = int(np.ceil((maxy - miny) / height)) + 1
    
    print(f"  Grid dimensions: ~{cols * rows} triangles")
    
    cells = []
    for col in range(cols):
        for row in range(rows):
            x = minx + col * (cell_size / 2)
            y = miny + row * height
            
            # Alternate triangle orientation
            if (col + row) % 2 == 0:
                # Upward pointing triangle
                triangle = Polygon([
                    (x, y),
                    (x + cell_size / 2, y + height),
                    (x - cell_size / 2, y + height)
                ])
            else:
                # Downward pointing triangle
                triangle = Polygon([
                    (x, y + height),
                    (x + cell_size / 2, y),
                    (x - cell_size / 2, y)
                ])
            
            if triangle.intersects(box(minx, miny, maxx, maxy)):
                cells.append(triangle)
    
    return cells


def _create_diamond_grid(minx, miny, maxx, maxy, cell_size):
    """Create diamond (rhombus) grid cells with proper tiling"""
    
    # For proper diamond tiling without gaps/overlaps:
    # - Each diamond is a square rotated 45 degrees
    # - Horizontal spacing: cell_size (diamonds touch left-right)
    # - Vertical spacing: cell_size / 2 (diamonds interlock top-bottom)
    # - Every other row offset by cell_size / 2
    
    horiz_spacing = cell_size
    vert_spacing = cell_size / 2  # This is the key - half the horizontal spacing!
    
    cols = int(np.ceil((maxx - minx) / horiz_spacing)) + 2
    rows = int(np.ceil((maxy - miny) / vert_spacing)) + 2
    
    print(f"  Grid dimensions: ~{cols * rows} diamonds")
    
    cells = []
    for row in range(rows):
        for col in range(cols):
            # Calculate center position
            center_x = minx + col * horiz_spacing
            center_y = miny + row * vert_spacing
            
            # Offset every other row by half spacing
            if row % 2 == 1:
                center_x += horiz_spacing / 2
            
            # Create diamond (square rotated 45 degrees)
            # The diamond extends cell_size/2 in each cardinal direction from center
            half_size = cell_size / 2
            diamond = Polygon([
                (center_x, center_y + half_size),      # Top
                (center_x + half_size, center_y),      # Right
                (center_x, center_y - half_size),      # Bottom
                (center_x - half_size, center_y)       # Left
            ])
            
            if diamond.intersects(box(minx, miny, maxx, maxy)):
                cells.append(diamond)
    
    return cells


def add_grid_statistics(grid_file, input_file, output_file, 
                        stats=['count', 'area'], output_dir="/data/"):
    """
    Add statistics from input features to grid cells
    
    Parameters:
    -----------
    grid_file : str
        Grid file path
    input_file : str
        Input vector file with features to analyze
    output_file : str
        Output filename
    stats : list
        Statistics to calculate: 'count', 'area', 'length'
    output_dir : str
        Output directory
    
    Returns:
    --------
    str : Path to output file with statistics
    """
    
    print(f"Loading grid: {grid_file}")
    grid = gpd.read_file(grid_file)
    
    print(f"Loading features: {input_file}")
    features = gpd.read_file(input_file)
    
    # Ensure same CRS
    if grid.crs != features.crs:
        print(f"Reprojecting features to {grid.crs}")
        features = features.to_crs(grid.crs)
    
    print("Calculating statistics...")
    
    # Initialize statistics columns
    if 'count' in stats:
        grid['feature_count'] = 0
    if 'area' in stats:
        grid['feature_area'] = 0.0
    if 'length' in stats:
        grid['feature_length'] = 0.0
    
    # Calculate statistics for each grid cell
    for idx, cell in grid.iterrows():
        # Find features that intersect this cell
        intersecting = features[features.intersects(cell.geometry)]
        
        if 'count' in stats:
            grid.at[idx, 'feature_count'] = len(intersecting)
        
        if 'area' in stats:
            total_area = 0
            for feat in intersecting.geometry:
                intersection = cell.geometry.intersection(feat)
                total_area += intersection.area
            grid.at[idx, 'feature_area'] = total_area
        
        if 'length' in stats:
            total_length = 0
            for feat in intersecting.geometry:
                intersection = cell.geometry.intersection(feat)
                if hasattr(intersection, 'length'):
                    total_length += intersection.length
            grid.at[idx, 'feature_length'] = total_length
    
    # Save
    output_path = Path(output_dir) / f"{output_file}.geojson"
    grid.to_file(output_path, driver='GeoJSON')
    
    print(f"✓ Grid with statistics saved: {output_path}")
    
    # Print summary
    if 'count' in stats:
        print(f"  Total features in grid: {grid['feature_count'].sum():.0f}")
        print(f"  Max features per cell: {grid['feature_count'].max():.0f}")
    
    return str(output_path)


def _parse_bool(value):
    if isinstance(value, bool):
        return value
    normalized = str(value).strip().lower()
    if normalized in {"true", "1", "yes", "y"}:
        return True
    if normalized in {"false", "0", "no", "n"}:
        return False
    raise ValueError(f"Invalid boolean value: {value}")


def _build_parser():
    parser = argparse.ArgumentParser(
        description="Create a regular grid from the extent of an input vector file."
    )
    parser.add_argument(
        "--input-file",
        type=str,
        required=True,
        help="Input vector file used to derive the grid extent.",
    )
    parser.add_argument(
        "--grid-type",
        type=str,
        choices=["square", "rectangle", "diamond"],
        default="square",
        help="Grid geometry type.",
    )
    parser.add_argument(
        "--cell-width",
        type=float,
        required=True,
        help="Grid cell width in CRS units (or meters when auto-reproject is true).",
    )
    parser.add_argument(
        "--cell-height",
        type=float,
        required=False,
        help="Grid cell height for rectangle grids. If omitted, width is used.",
    )
    parser.add_argument(
        "--output-file",
        type=str,
        default="regular_grid",
        help="Output file name without extension.",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        required=True,
        help="Writable output directory.",
    )
    parser.add_argument(
        "--auto-reproject",
        type=str,
        default="true",
        help="Whether to auto-reproject geographic CRS data to UTM (true/false).",
    )
    parser.add_argument(
        "--add-id",
        type=str,
        default="true",
        help="Whether to add a grid_id column (true/false).",
    )
    return parser


def main():
    parser = _build_parser()
    args = parser.parse_args()

    grid_type = args.grid_type
    if grid_type == "rectangle":
        if args.cell_height is None:
            parser.error("--cell-height is required when --grid-type=rectangle")
        cell_size = (args.cell_width, args.cell_height)
    else:
        cell_size = args.cell_width

    create_grid(
        input_file=args.input_file,
        cell_size=cell_size,
        output_file=args.output_file,
        grid_type=grid_type,
        add_id=_parse_bool(args.add_id),
        auto_reproject=_parse_bool(args.auto_reproject),
        output_dir=args.output_dir,
    )


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
IMPORTANT: CRS AND CELL SIZE

If your data is in geographic coordinates (degrees, like EPSG:4326):
  - Option 1: Set auto_reproject=True (DEFAULT) and use meters for cell_size
    → Grid is created in UTM, then reprojected back to original CRS
  
  - Option 2: Set auto_reproject=False and use degrees for cell_size
    → Example: cell_size=0.01 (approximately 1.1km at equator)

If your data is in projected coordinates (meters, like UTM):
  - Use meters directly for cell_size
  - auto_reproject setting is ignored
"""


if False:
    # Example 1: Grid with auto-reprojection (RECOMMENDED for geographic data)
    square_grid = create_grid(
        input_file="/data/test_sgp.geojson",  # In EPSG:4326
        cell_size=2000,  # 1000 meters - will auto-reproject to UTM
        output_file="grid_square_world",
        grid_type='square',
        auto_reproject=True  # Default is True
    )


if __name__ == "__main__":
    main()
