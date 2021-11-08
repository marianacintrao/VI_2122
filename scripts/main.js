var default_theme_average = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_theme_average.csv",
    default_themes_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_main_genre.csv",
    default_themes_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_specific_genre.csv",
    default_themes_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/default_themes_by_artist.csv",
    themes_by_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_artist.csv",
    themes_by_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_main_genre.csv",
    // themes_by_main_genre = "datasets/themes_by_main_genre.csv",
    themes_by_specific_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/themes_by_specific_genre.csv",
    artist_main_genre = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/artist_main_genre.csv"
    root_no_artist = "https://raw.githubusercontent.com/marianacintrao/VI_2122/main/datasets/root_no_artist_2.json"
    // root_no_artist = "datasets/root_no_artist_2.json"

var data_themes_by_artist;
var data_artist_main_genre;

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
        d3.csv(default_theme_average), 
        d3.csv(themes_by_artist), 
        d3.csv(artist_main_genre), 
        d3.json(root_no_artist), 
    ])
    .then(function([themes_by_main_genre, 
                    default_theme_average, 
                    themes_by_artist,
                    artist_main_genre,
                    root_no_artist]) {
        data_themes_by_artist = themes_by_artist;
        data_artist_main_genre = artist_main_genre;
        CircularPacking("#circularPacking", root_no_artist);
        RadarChart("#radarChart", default_theme_average, false);
        ParallelCoordinatesChart("#parallelCoordinates", themes_by_main_genre, false);
    });