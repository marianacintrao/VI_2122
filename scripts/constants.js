// set the dimensions and margins of the graph
const margin = {top: 30, right: 50, bottom: 10, left: 50},
    width = document.body.scrollWidth - margin.left - margin.right,
    height = window.screen.height,
    lineOpacity = "0.3",
    lineWidth = "3",
    parallelCoordMaxScale = 0.5;

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
// const _navy = "#000075";

const genres_dict = {
	"rock" : "Rock",
	"pop" : "Pop",
	"country" : "Country",
	"jazz" : "Jazz",
    "rnb" : "R&B",
    "hiphop" : "Hip-Hop",
    "reggae" : "Reggae",	
	"folk" : "Folk",
    "punk" : "Punk",
    "blues" : "Blues",
    "electronica" : "Electronica",
    "religious" : "Religious",
	"metal" : "Metal"
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
    "feelings" : "Feelings",
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
};