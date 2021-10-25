function ParallelCoordinatesChart(id, data) {
// append the svg object to the body of the page
    var svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const color = d3.scaleOrdinal()
        .domain(["rock", "pop", "jazz",    "country", "rnb",   "hiphop", "reggae", "folk", "metal", "blues", "punk",   "electronica", "religious"])
        .range([ _red,   _pink, _lavender, _orange,   _purple, _lime,    _olive,   _green, _yellow, _blue,   _magenta, _teal,         _cyan])

    // Here I set the list of dimension manually to control the order of axis:
    dimensions = ["dating", "violence", "world/life", "night/time", "shake the audience", "family/gospel", "romantic", "communication", "obscene", "music", "movement/places", "light/visual perceptions", "family/spiritual", "like/girls", "sadness", "feelings"]
    // For each dimension, I build a linear scale. I store all in a y object
    const y = {}
    for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scaleLinear()
            .domain([0, parallelCoordMaxScale])
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
            .style("stroke-width", lineWidth)
            .style("opacity", lineOpacity)
            
        // Second the hovered specie takes its color
        d3.selectAll("." + selected_genre)
            .transition().duration(200)
            .style("stroke", color(selected_genre))
            .style("stroke-width", lineWidth)
            .style("opacity", "1")
        // Bring line forward (for better visibility)
        d3.select(this).moveToFront();
            
        // Tooltip
        d3.select("#tooltip")
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .style("opacity", 1)
        .style("background-color", color(selected_genre))
        .select("#value")
        .text(genres_dict[d.main_genre]);
    }
    
    // Unhighlight
    const doNotHighlight = function(event, d) {
        d3.selectAll(".line")
        // .transition().duration(200)
        .style("stroke", _grey)
        // .style("stroke", function(d) { return( color(d.main_genre))} )
        .style("stroke-width", lineWidth)
        .style("opacity", lineOpacity)

        // Hide the tooltip
        d3.select("#tooltip")
            .style("opacity", 0);
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
            .style("font-family", "Lucida Console")
            .style("color", _white)
        })
        // Axis titles
        .append("text")
        .style("text-anchor", "middle")
        .style("font-family", "Lucida Console")
        .attr("y", -9)
        .text(function(d) { return attributes[d]; })
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
        .style("stroke-width", lineWidth)
        .style("opacity", lineOpacity)
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight)
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
};