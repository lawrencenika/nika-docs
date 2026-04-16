generate_random_spatial_data <- function(
    n_polygons = 5,
    n_points = 50,
    min_sides = 3,
    max_sides = 8,
    seed = 42
) {
  library(sf)
  
  # Set seed for reproducibility
  set.seed(seed)
  
  # Singapore bounding box (approximate)
  sg_bbox <- st_bbox(c(
    xmin = 103.6,
    xmax = 104.1,
    ymin = 1.15,
    ymax = 1.47
  ), crs = st_crs(4326))
  
  # Function to generate one random polygon
  generate_polygon <- function() {
    n_sides <- sample(min_sides:max_sides, 1)
    
    # Random center
    center_x <- runif(1, sg_bbox["xmin"], sg_bbox["xmax"])
    center_y <- runif(1, sg_bbox["ymin"], sg_bbox["ymax"])
    
    # Random radius (small so shapes stay local)
    radius <- runif(1, 0.01, 0.05)
    
    # Generate angles
    angles <- sort(runif(n_sides, 0, 2 * pi))
    
    # Create polygon points
    x <- center_x + radius * cos(angles)
    y <- center_y + radius * sin(angles)
    
    # Close polygon
    coords <- cbind(x, y)
    coords <- rbind(coords, coords[1, ])
    
    st_polygon(list(coords))
  }
  
  # Generate polygons
  polygons <- st_sfc(
    lapply(1:n_polygons, function(i) generate_polygon()),
    crs = 4326
  )
  
  polygons_sf <- st_sf(
    id = 1:n_polygons,
    geometry = polygons
  )
  
  # Generate random points
  points <- data.frame(
    x = runif(n_points, sg_bbox["xmin"], sg_bbox["xmax"]),
    y = runif(n_points, sg_bbox["ymin"], sg_bbox["ymax"])
  )
  
  points_sf <- st_as_sf(points, coords = c("x", "y"), crs = 4326)
  
  return(list(
    polygons = polygons_sf,
    points = points_sf
  ))
}