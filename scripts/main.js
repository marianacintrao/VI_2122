const default_theme_average = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_theme_average.csv",
    default_themes_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_main_genre.csv",
    default_themes_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_specific_genre.csv",
    default_themes_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_artist.csv",
    themes_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_artist.csv",
    themes_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_main_genre.csv",
    themes_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_specific_genre.csv",
    artist_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/artist_main_genre.csv",
    artist_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/artist_genre.csv",
    root_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/root_by_main_genre.json",
    root_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/root_by_specific_genre.json",
    root_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/root_by_artist.json"

var data_themes_by_artist,
    data_artist_main_genre,
    data_themes_by_main_genre,
    data_themes_by_specific_genre,
    data_artist_specific_genre,
    data_circular_packing = [],
    data_index = 0,
    currentLevel = "avg",
    currentTheme = "theme_weight",
    previousLevel = "";

//enter input
var input = document.getElementById("searchbarvalue");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchBar();
        document.getElementById("searchbarvalue").value = '';
    }
});

Promise
    .all([

        d3.csv(themes_by_main_genre),
        d3.csv(themes_by_specific_genre),
        d3.csv(default_theme_average), 
        d3.csv(themes_by_artist), 
        d3.csv(artist_main_genre), 
        d3.csv(artist_specific_genre), 
        d3.json(root_by_main_genre), 
        d3.json(root_by_specific_genre), 
        d3.json(root_by_artist), 
    ])
    .then(function([themes_by_main_genre,
                    themes_by_specific_genre,
                    default_theme_average, 
                    themes_by_artist,
                    artist_main_genre,
                    artist_specific_genre,
                    root_by_main_genre,
                    root_by_specific_genre,
                    root_by_artist
                ]) {
        data_themes_by_main_genre = themes_by_main_genre;
        data_themes_by_specific_genre = themes_by_specific_genre;
        data_themes_by_artist = themes_by_artist;
        data_artist_main_genre = artist_main_genre;
        data_artist_specific_genre = artist_specific_genre;
        data_circular_packing.push(root_by_main_genre)
        data_circular_packing.push(root_by_specific_genre)
        data_circular_packing.push(root_by_artist)
        circularPacking("#circularPacking");
        RadarChart("#radarChart", default_theme_average, false);
        ParallelCoordinatesChart("#parallelCoordinates", false);
    });

function goBack() {
    if (data_index > 0) {
        currentLevel = previousLevel;
        data_index -= 1;
        if (data_index == 1) {
            //previousLevel = "avg";
            changeDataset(data_themes_by_specific_genre);
        }
        else if (data_index == 0) {
            previousLevel = "";
            changeDataset(data_themes_by_main_genre);
        }
        changeAreaEncoding("#circularPacking");
    }
    drawParallelCoordinatesLines()
}

// 0 = avg -> mains
// 1 = mains -> spec
// 2 = spec -> artist