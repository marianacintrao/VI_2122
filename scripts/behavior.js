const _white = "#fafcfb";
const _grey = "#a9a9a9";
const _red = "#e6194B";
const _pink = "#fabed4";
const _navy = "#000075";
const _orange = "#f58231";
const _purple = "#911eb4";
const _lime = "#bfef45";
const _olive = "#808000";
const _green = "#3cb44b";
const _yellow = "#ffe119";
const _blue = "#4363d8";
const _magenta = "#f032e6";
const _teal = "#469990";
const _cyan = "#42d4f4";

// set the dimensions and margins of the graph
const margin = {top: 30, right: 50, bottom: 10, left: 50},
  width = document.body.scrollWidth - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
  console.log("width = " + document.body.scrollWidth);

// append the svg object to the body of the page
const svg = d3.select("#parallelCoordinates")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("datasets/themes_by_main_genre.csv").then(function(data) {
  // Color scale: give me a specie name, I return a color
  const color = d3.scaleOrdinal()
    .domain(["rock", "pop", "jazz", "country", "rnb",   "hiphop", "reggae", "folk", "metal", "blues", "punk",   "eletronica", "religious"])
    .range([ _red,   _pink, _navy,  _orange,   _purple, _lime,     _olive,   _green, _yellow, _blue,   _magenta, _teal,         _cyan])

  // Here I set the list of dimension manually to control the order of axis:
  dimensions = ["dating", "violence", "world/life", "night/time", "shake the audience", "family/gospel", "romantic", "communication", "obscene", "music", "movement/places", "light/visual perceptions", "family/spiritual", "like/girls", "sadness", "feelings"]
  // For each dimension, I build a linear scale. I store all in a y object
  const y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain([0, 0.5])
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

  // Highlight the specie that is hovered
  const highlight = function(event, d) {
    selected_genre = d.main_genre

    // first every group turns grey
    d3.selectAll(".line")
      // .transition().duration(200)
      .style("stroke", _grey)
      .style("stroke-width", "3")
      .style("opacity", "0.5")
    
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_genre)
      .transition().duration(200)
      .style("stroke", color(selected_genre))
      .style("opacity", "1")
  }

  // Unhighlight
  const doNotHighlight = function(event, d) {
    d3.selectAll(".line")
      // .transition().duration(200)
      .style("stroke", _grey)
      // .style("stroke", function(d) { return( color(d.main_genre))} )
      .style("opacity", "0.5")
  }

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the axis:
  svg.selectAll("myAxis")
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    .attr("transform", function(d) { return `translate(${x(d)})`})
    .each(function(d) { d3
      .select(this)
      .call(d3
        .axisLeft()
        .ticks(5)
        .scale(y[d])
        )
      // Axis and axis values color
      .style("color", _white)
    })
    // Axis titles
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) { return d; })
    .style("fill", _white)
    
  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
    .attr("class", function (d) { return "line " + d.main_genre } )
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", _grey)
    .style("stroke-width", "3")
    .style("opacity", "0.5")
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight)
})