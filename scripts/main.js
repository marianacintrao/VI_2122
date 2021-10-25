d3.csv("datasets/themes_by_main_genre.csv").then(function(data) {
    ParallelCoordinatesChart("#parallelCoordinates", data);
    RadarChart("#radarChart", data);
})