var data,
    svg,
    y,
    name;

function clickParallelCoorAxis(id, at_name) {
    if (d3.selectAll("#parallel-coor-axis_" + at_name).classed("clicked")) {
        d3
            .select(id)
            .select("svg")
            .selectAll("g")
            .selectAll(".axis")
            .classed("clicked", false);
        return;
    }

    d3
        .select(id)
        .selectAll("g")
        .each(function() {
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
    
    changeParallelCoorAxisColor(at_name, _white);
    d3.selectAll("#parallel-coor-axis_" + at_name).classed("clicked", true);
}

function changeParallelCoorAxisColor(at_name, col) {
    if (d3.selectAll("#parallel-coor-axis_" + at_name).classed("clicked")) { return; }

    d3
        .selectAll("#parallel-coor-axis_" + at_name)
        .style("color", col);
    d3
        .selectAll("#parallel-coor-text_" + at_name)
        .style("fill", col);
}

function changeToSubgenreLevel(name) {
    data = data_themes_by_specific_genre.filter(function(d) {
        if (d.main_genre == name) {
            return d;
        }
    })

    drawParallelCoordinatesLines();

    var lineColor;
    var parentData;
    if (data_index == 1) {
        lineColor =  color(name)
        parentData = data_themes_by_main_genre.filter(function(d) {
            if (d.main_genre == name) {
                return d;
            }
        })
    }
    else if (data_index == 2) {
        lineColor = color(previousLevel);
        parentData = data_themes_by_specific_genre.filter(function(d) {
            if (d.specific_genre == name) {
                return d;
            }
        })
    }
    drawParentLine(parentData, lineColor);
    RadarChart("#radarChart", parentData, true)
}

function changeToArtistLevel(name) {
    let artist_list = []
    data_artist_specific_genre.filter(function(d) {
        if (d.specific_genre == name) {
            artist_list.push(d.artist_name)
        }
    })

    data = data_themes_by_artist.filter(function(d) {
        if (artist_list.includes(d.artist_name)) {
            return d;
            
        }});
        
    drawParallelCoordinatesLines();

    var lineColor;
    var parentData;
    if (data_index == 1) {
        lineColor =  color(name)
        parentData = data_themes_by_main_genre.filter(function(d) {
            if (d.main_genre == name) {
                return d;
            }
        })
    }
    else if (data_index == 2) {
        lineColor = color(previousLevel);
        parentData = data_themes_by_specific_genre.filter(function(d) {
            if (d.specific_genre == name) {
                return d;
            }
        })
    }

    drawParentLine(parentData, lineColor);
    RadarChart("#radarChart", parentData, true)
}

function path(d) {
    return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}

function drawParentLine(data, lineColor) {
    svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "parallelCoordLinesParent")
        .attr("id", function (d) { return "parallelCoordLine " + d.main_genre.replace(/ /g,"") } )
        .attr("name", function(d) { return d.main_genre; })
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", lineColor)
        .style("stroke-width", 4)
        .style("opacity", 0.8)
        .moveToFront()
}

function drawParallelCoordinatesLines() {
    d3
        .selectAll(".parallelCoordLines")
        .remove();
    d3
        .selectAll(".parallelCoordLinesParent")
        .remove();


    svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "parallelCoordLines")
        .attr("id", function (d) {
            if (data_index == 0)
                return "parallelCoordLine-" + d.main_genre.replace(/ /g, "").replace("'", "").replace("&", "n"); 
            else if (data_index == 1)
                return "parallelCoordLine-" + d.specific_genre.replace(/ /g, "").replace("'", "").replace("&", "n");
            else {
                
                return "parallelCoordLine-" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n");
            }
        })
        .attr("name", function(d) { 
            if (data_index == 0)
                return d.main_genre; 
            else if (data_index == 1) 
                return d.specific_genre;
            else 
                return d.artist_name;
        })
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", _grey)
        .style("stroke-width", lineWidth)
        .style("opacity", 0.1)
        .on("click", function(d) {
            if (data_index < 2) {
                data_index = data_index + 1;
                previousLevel = currentLevel;
                currentLevel = this.getAttribute("name");
                changeAreaEncoding("#circularPacking");
                if (data_index == 1) changeToSubgenreLevel(currentLevel);
                else if (data_index == 2) changeToArtistLevel(currentLevel);
            }
        })
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight)
}

function highlightLine(name, color, d) {
    d3
        .select("#parallelCoordLine-" + name.replace(/ /g, "").replace("'", "").replace("&", "n"))
        .style("stroke", color)
        .style("stroke-width", lineWidth)
        .style("opacity", "1")
        .moveToFront();
    
    // addRadarArea(, "parallel", cssolor);
}

function unhighlightLine(name) {
    d3
        .select("#parallelCoordLine-" + name.replace(/ /g, "").replace("'", "").replace("&", "n"))
        .style("stroke", _grey)
        .style("stroke-width", lineWidth)
        .style("opacity", 0.1)
}


const highlight = function(event, d) {
    var selected;
    if (data_index == 0)
        selected = d.main_genre
    else if (data_index == 1) 
        selected = d.specific_genre
    else 
        selected = d.artist_name

    var lineColor;

    d3
        .selectAll(".parallelCoordLines")
        .style("stroke", _grey)
        .style("stroke-width", lineWidth)
        .style("opacity", 0.1)    

    d3
        .select("#parallelCoordLine-" + selected.replace(/ /g, "").replace("'", "").replace("&", "n"))
        .style("stroke", function() {
            if (data_index == 2)
                lineColor = color(previousLevel)
            else 
                lineColor = color(d.main_genre)
            return lineColor
        })
        .style("stroke-width", lineWidth)
        .style("opacity", "1")

    d3
        .select(this)
        .moveToFront();

    d3
        .select("#tooltip-parallelCoordinates")
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .style("opacity", 1)
        .style("background-color", lineColor)
        .select("#value")
            .text(selected);

    addRadarArea(d, "parallel", lineColor);
    highlightCircle(selected);
}

const doNotHighlight = function(event, d) {
    var selected;
    if (data_index == 0)
        selected = d.main_genre
    else if (data_index == 1) 
        selected = d.specific_genre
    else 
        selected = d.artist_name
    d3
        .select("#parallelCoordLine-" + selected.replace(/ /g, "").replace("'", "").replace("&", "n"))
        .style("stroke", _grey)
        .style("stroke-width", lineWidth)
        .style("opacity", 0.1)

    d3
        .select("#tooltip-parallelCoordinates")
        .style("opacity", 0);

    d3.selectAll("#path-hovered_" + "parallel").remove();
    d3.selectAll("#g-hovered_" + "parallel").remove();

    unhighlightCircle(selected.replace(/ /g, "").replace("'", "").replace("&", "n"));
}

function changeDataset(dataset_name) {
    if (data_index == 1) {
        data = dataset_name.filter(function(d) {
            if (d.main_genre == currentLevel)
                return d;
        });
    }
    else 
        data = dataset_name
}

function ParallelCoordinatesChart(id) {
    svg  = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height / 4)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top+10})`);

    // data = data_themes_by_specific_genre.filter(function(d) {
    //     if (d.main_genre == ) {
    //         console.log(d.specific_genre);
    //         return d;
    //     }
    // })
    changeDataset(data_themes_by_main_genre)

    dimensions = ["dating", "violence", "world/life", "night/time", "shake the audience", "family/gospel", "romantic", "communication", "obscene", "music", "movement/places", "light/visual perceptions", "family/spiritual", "like/girls", "sadness", "feelings"]
    
    y = {};
    for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scaleLinear()
            .domain([0, 1])
            .range([height / 5, 0])
    }

    x = d3
        .scalePoint()
        .range([0, width])
        .domain(dimensions);

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
                changeAreaEncoding("#circularPacking");
            })
        })
        .append("text")
            .attr("id", function(i) { return "parallel-coor-text_" + attributes[i]; })
            .style("text-anchor", "middle")
            .style("font-family", "Lato")
            .attr("y", -9)

            .text(function(d) { return attributes[d]; })
            .style("fill", _grey)

    drawParallelCoordinatesLines();
}