var default_theme_average = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_theme_average.csv",
    default_themes_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_main_genre.csv",
    default_themes_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_specific_genre.csv",
    default_themes_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_artist.csv",
    themes_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_artist.csv",
    themes_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_main_genre.csv",
    themes_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_specific_genre.csv"

Promise
    .all([
        d3.csv(themes_by_main_genre),
        d3.csv(default_theme_average) 
    ])
    .then(function([themes_by_main_genre, default_theme_average]) {
        ParallelCoordinatesChart("#parallelCoordinates", themes_by_main_genre, false);
        RadarChart("#radarChart", default_theme_average, false);
    });