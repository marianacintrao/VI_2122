const default_theme_average = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_theme_average.csv",
    default_themes_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_main_genre.csv",
    default_themes_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_specific_genre.csv",
    default_themes_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_artist.csv",
    themes_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_artist.csv",
    themes_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_main_genre.csv",
    // themes_by_main_genre = "datasets/themes_by_main_genre.csv",
    themes_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_specific_genre.csv",
    artist_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/artist_main_genre.csv"
    root = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/root.json"
    root_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/root_by_main_genre.json"
    // root_no_artist = "datasets/root_no_artist_2.json"
    // root_by_main_genre = "datasets/root_no_specific_genre.json"

var data_themes_by_artist,
    data_artist_main_genre,
    data_root,
    data_root_by_main_genre,
    data_circular_packing;

//enter input
var input = document.getElementById("searchbarvalue");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchBar();
        document.getElementById("searchbarvalue").value = '';
    }
});

var currentLevel = "avg",
    currentTheme = "theme_weight";

Promise
    .all([
        d3.csv(themes_by_main_genre),
        d3.csv(default_theme_average), 
        d3.csv(themes_by_artist), 
        d3.csv(artist_main_genre), 
        d3.json(root), 
        d3.json(root_by_main_genre), 
    ])
    .then(function([themes_by_main_genre, 
                    default_theme_average, 
                    themes_by_artist,
                    artist_main_genre,
                    root,
                    root_by_main_genre
                ]) {
        data_themes_by_artist = themes_by_artist;
        data_artist_main_genre = artist_main_genre;
        data_root = root_by_main_genre;
        data_root_by_main_genre = root_by_main_genre;
        circularPacking("#circularPacking", data_root);
        // changeAreaEncoding("#circularPacking", data_root);
        RadarChart("#radarChart", default_theme_average, false);
        ParallelCoordinatesChart("#parallelCoordinates", themes_by_main_genre, false);
    });