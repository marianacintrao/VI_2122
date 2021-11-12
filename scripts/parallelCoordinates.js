function clickParallelCoorAxis(id, at_name) {
    // check if axis is already clicked
    if (d3.selectAll("#parallel-coor-axis_" + at_name).classed("clicked")) {
        // if clicked, unlick, go back to default and return
        d3.select(id).select("svg").selectAll("g").selectAll(".axis").classed("clicked", false);
        return;
    }

    // Turn already selected axis grey and unclicking it
    d3.select(id).selectAll("g").each(function() {
        if (d3.select(this).classed("clicked")) {
            var id_name = d3.select(this).attr("id");
            if (id_name) {
                var at_name = id_name.split('_')[1];
                d3
                    .selectAll("#parallel-coor-axis_" + at_name)
                    .style("color", _grey)
                    .classed("clicked", false);
                
                d3
                    .selectAll("#parallel-coor-text_" + at_name)
                    .style("fill", _grey);
            }
        }
    })
    
    // change axis color to highlighted
    changeParallelCoorAxisColor(at_name, _white)

    // this axis clicked = true
    d3.selectAll("#parallel-coor-axis_" + at_name).classed("clicked", true)
}


function changeParallelCoorAxisColor(at_name, col) {
    
    // olny change color if not clicked
    if (d3.selectAll("#parallel-coor-axis_" + at_name).classed("clicked")) {
        return;
    }

    d3
        .selectAll("#parallel-coor-axis_" + at_name)
        .style("color", col);
    d3
        .selectAll("#parallel-coor-text_" + at_name)
        .style("fill", col);
}

function ParallelCoordinatesChart(id, data, update) {
// append the svg object to the body of the page
    var svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height / 4)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top+10})`);

     
    // Here I set the list of dimension manually to control the order of axis:
    dimensions = ["dating", "violence", "world/life", "night/time", "shake the audience", "family/gospel", "romantic", "communication", "obscene", "music", "movement/places", "light/visual perceptions", "family/spiritual", "like/girls", "sadness", "feelings"]
    
    // For each dimension, I build a linear scale. I store all in a y object
    const y = {}
    for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scaleLinear()
            .domain([0, parallelCoordMaxScale])
            .range([height / 5, 0])
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
        d3.selectAll("." + selected_genre.replace(/ /g,"."))
            .style("stroke", color(selected_genre))
            .style("stroke-width", lineWidth)
            .style("opacity", "1")
        // Bring line forward (for better visibility)
        d3.select(this).moveToFront();
            
        // Tooltip
        d3.select("#tooltip-parallelCoordinates")
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .style("opacity", 1)
        .style("background-color", color(selected_genre))
        .select("#value")
        .text(genres_dict[d.main_genre]);

        addRadarArea(d, "parallel", color(selected_genre));
    }
    
    // Unhighlight
    const doNotHighlight = function(event, d) {
        d3.selectAll(".parallelCoordLine")
        .style("stroke", _grey)
        .style("stroke-width", lineWidth)
        .style("opacity", lineOpacity)

        // Hide the tooltip
        d3.select("#tooltip-parallelCoordinates")
            .style("opacity", 0);

        // Remove radar area
        d3.selectAll("#path-hovered_" + "parallel").remove();
        d3.selectAll("#g-hovered_" + "parallel").remove();
    }

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Draw the axis:
    svg
        .selectAll("myAxis")
        .data(dimensions).enter()
        .append("g")
        .attr("class", "axis")
        .attr("id", function(i) { return "parallel-coor-axis_" + attributes[i]; })
        .attr("name", function(i) { return attributes[i]; })
        .attr("transform", function(d) { return `translate(${x(d)})`})
        .each(function(d) { d3
            .select(this)
            .call(d3
                .axisLeft()
                .ticks(5)
                .scale(y[d])
            )
            // Axis and axis values color
            .style("font-family", "Lato")
            .style("color", _grey)
            .on("mouseover", function() {
                changeParallelCoorAxisColor(this.getAttribute("name"), _white);
                changeRadarAxisColor(this.getAttribute("name"), _white);
            })
            .on("mouseleave", function() {
                changeParallelCoorAxisColor(this.getAttribute("name"), _grey);
                changeRadarAxisColor(this.getAttribute("name"), _grey);
            })
            .on("click", function() {
                clickParallelCoorAxis(id, this.getAttribute("name"));
                clickRadarAxis(radarChart, this.getAttribute("name"));
                currentTheme = this.getAttribute("name");
                changeAreaEncoding("#circularPacking", currentLevel);
            })
        })
        .append("text")
            .attr("id", function(i) { return "parallel-coor-text_" + attributes[i]; })
            .style("text-anchor", "middle")
            .style("font-family", "Lato")
            .attr("y", -9)

            .text(function(d) { return attributes[d]; })
            .style("fill", _grey)

    // Draw the lines
    svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .append("path")
        .attr("class", function (d) { return "parallelCoordLine " + d.main_genre } )
        .attr("name", function(d) { return d.main_genre; })
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", _grey)
        .style("stroke-width", lineWidth)
        .style("opacity", lineOpacity)
        .on("click", function(d) {
            currentLevel = this.getAttribute("name");
            changeAreaEncoding("#circularPacking", currentLevel) 
        })
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight)
}