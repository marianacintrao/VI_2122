// set the dimensions and margins of the graph
const margin = {top: 30, right: 50, bottom: 10, left: 50},
    width = document.body.scrollWidth - margin.left - margin.right,
    height = window.screen.height,
    lineOpacity = "0.3",
    lineWidth = "3",
    parallelCoordMaxScale = 0.5;

const p = 70;

const _white = "#fafcfb",
    _grey = "#a9a9a9",
    _red = "#e6194B",
    _pink = "#fabed4",
    _lavender = "#dcbeff",
    _orange = "#f58231",
    _purple = "#911eb4",
    _lime = "#bfef45",
    _olive = "#808000",
    _green = "#3cb44b",
    _yellow = "#ffe119",
    _blue = "#4363d8",
    _magenta = "#f032e6",
    _teal = "#469990",
    _cyan = "#42d4f4";

const radarColors = [
    "#ffd8b1", //apricot
    "#aaffc3", //mint
    "#dcbeff", //lavender
    "#fffac8", // beige
    "#CCFDFF", //light blue
]

const genres_dict = {
	"rock" : "Rock",
	"pop" : "Pop",
	"country" : "Country",
	"jazz" : "Jazz",
    "rnb" : "R&B",
    "hip hop" : "Hip-Hop",
    "reggae" : "Reggae",	
	"folk" : "Folk",
    "punk" : "Punk",
    "blues" : "Blues",
    "electronica" : "Electronica",
    "religious" : "Religious",
	"metal" : "Metal"
}

const reverse_genres_dict = {
	"Rock" : "rock",
	"Pop" : "pop",
	"Country" : "country",
	"Jazz" : "jazz",
    "R&B" : "rnb",
    "Hip-Hop" : "hip hop",
    "Reggae" : "reggae",	
	"Folk" : "folk",
    "Punk" : "punk",
    "Blues" : "blues",
    "Electronica" : "electronica",
    "Religious" : "religious",
	"Metal" : "metal"
}

const attributes = {
    "dating" : "Dating",
    "violence" : "Violence",
    "world/life" : "Life",
    "night/time" : "Time",
    "shake the audience" : "Audience",
    "family/gospel" : "Family",
    "romantic" : "Romantic",
    "communication" : "Communication",
    "obscene" : "Obscene",
    "music" : "Music",
    "movement/places" : "Places",
    "light/visual perceptions" : "Visual",
    "family/spiritual" : "Spiritual",
    "like/girls" : "Girls",
    "sadness" : "Sadness",
    "feelings" : "Feelings"
}

const reverse_attributes = {
    "Dating" : "dating",
    "Violence" : "violence",
    "Life" : "world/life",
    "Time" : "night/time",
    "Audience" : "shake the audience",
    "Family" : "family/gospel",
    "Romantic" : "romantic",
    "Communication" : "communication",
    "Obscene" : "obscene",
    "Music" : "music",
    "Places" : "movement/places",
    "Visual" : "light/visual perceptions",
    "Spiritual" : "family/spiritual",
    "Girls" : "like/girls",
    "Sadness" : "sadness",
    "Feelings" : "feelings"
}

const color = d3
    .scaleOrdinal()
    .domain(["other", "rock", "pop", "jazz",    "country", "rnb",   "hip hop", "reggae", "folk", "metal", "blues", "punk",   "electronica", "religious"])
    .range([ _grey,   _red,   _pink, _lavender, _orange,   _purple, _lime,     _olive,   _green, _yellow, _blue,   _magenta, _teal,         _cyan])
 

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
};

const attrs_to_json = {
    "dating" : "dating",
    "violence" : "violence",
    "world/life" : "life",
    "night/time" : "time",
    "shake the audience" : "audience",
    "family/gospel" : "family",
    "romantic" : "romantic",
    "communication" : "communication",
    "obscene" : "obscene",
    "music" : "music",
    "movement/places" : "places",
    "light/visual perceptions" : "visual",
    "family/spiritual" : "spiritual",
    "like/girls" : "girls",
    "sadness" : "sadness",
    "feelings" : "feelings"
}

var theme_name = "theme_weight"