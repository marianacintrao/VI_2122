const t = height / 3 + (p / 3)

let num_artist_areas = 0;

let radarCfg = {
    w: width,
    h: height / 3 + (p / 3),
    margin: {
        // top: t + p ,
        top: - t*13/20,
        // top: 0,
        right: 0,
        bottom: 0,
        left: width * 14/20   
        // left: 0   
    },
    opacityArea: 0.35,
    dotRadius: 2,
    opacityCircles: 0.5,
    lineOpacity: 0.9,
    lineWidth: 3,
    shapeOpacity: 0.7,
    gridOpacity: 0.3,
    maxValue: 1,
    defaultColor: _grey,
    highlightColor: _white
};

let radius = Math.min(radarCfg.w/2, radarCfg.h/2),
    maxValue = radarCfg.maxValue,
    rScale = d3
            .scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);


function clickRadarAxis(id, at_name) {
    
    // check if axis is already clicked
    if (d3.selectAll("#radar-chart-axis_" + at_name).classed("clicked")) {

        // if clicked, unlick, go back to default and return
        d3.select(id).select("svg").selectAll("line").classed("clicked", false);

        currentTheme = "theme_weight";
        return;
    }


    // Turn already selected axis grey and unclicking it
    d3.select(id).select("svg").selectAll("line").each(function() {
        if (d3.select(this).classed("clicked")) {

            var id_name = d3.select(this).attr("id");
            
            if (id_name) {
                var at_name = id_name.split('_')[1];
                
                d3
                .selectAll("#radar-chart-axis_" + at_name)
                .style("color", radarCfg.defaultColor)
                .classed("clicked", false);
                d3
                .selectAll("#radar-chart-text_" + at_name)
                .style("fill", radarCfg.defaultColor);
            }
        }
    })

    // change theme encoding
    currentTheme = reverse_attributes[at_name]
    
    // change axis color to highlighted
    changeRadarAxisColor(at_name, radarCfg.highlightColor)

    // this axis clicked = true
    d3.selectAll("#radar-chart-axis_" + at_name).classed("clicked", true)

}

function radarGoBack() {
    var parentData;
    if (data_index == 0) {
        parentData = data_default_theme_average; 
    }
    else if (data_index == 1) {
        parentData = data_themes_by_main_genre.filter(function(d) {
            if (d.main_genre == currentLevel) {
                return d;
            }
        })
    }
    RadarChart("#radarChart", parentData, true)
    if (data_index == 1) {console.log("sdjfgsjdgasjdh");drawParentLine(parentData, color(currentLevel));}
}

function changeRadarAxisColor(at_name, col) {

    // olny change color if not clicked
    if (d3.selectAll("#radar-chart-axis_" + at_name).classed("clicked")) {
        return;
    }
    d3.selectAll("#radar-chart-text_" + at_name).style("fill", col);
    d3.selectAll("#radar-chart-axis_" + at_name).attr("stroke", col);
}

function getPathCoordinates(data_point) {
    let coordinates = [];
    let length = Object.keys(attributes).length;
    for (let i = 0; i < length; i++) {
        let at_name = Object.keys(attributes)[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / length);
        let value = data_point[at_name];
        coordinates.push(angleToCoordinate(angle, value));
        // coordinates.push();
        if (value > maxValue) {
            maxValue = value;
        }
    }
    return coordinates;
}

function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * rScale(value);
    let y = Math.sin(angle) * rScale(value);
    return {"x": radarCfg.margin.left + x, "y": radarCfg.margin.top - y, "value": value};
}

function getArtistColor(name) {
    // GET ARTIST MAIN GENRE TO GET COLOR
    data_artist_main_genre.filter(function (d) {
        if (d.artist_name == name) {
            // return color(d["main_genre"]);
            return d;
        }
    })
}

const highlightRadar = function(event, d) {  
    d3.select(this)
        .moveToFront()
        .classed("radarShapeHighlight", true);
    d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n"))
        .moveToFront()
        .classed("radarDotsHighlight", true);
}
const doNotHighlightRadar = function(event, d) {  
    d3.select(this)
        .classed("radarShapeHighlight", false);
    d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n"))
        .moveToFront()
        .classed("radarDotsHighlight", false);
}

const highlightRadarDot = function(event, d) {  
    // Tooltip
    d3.select("#tooltip-radarChart")
    .style("left", event.pageX + "px")
    .style("top", event.pageY + "px")
    .style("opacity", 1)
    .style("background-color", _white)
    .select("#value")
    .text(d["value"]);
}
const doNotHighlightRadarDot = function(event, d) {  
    // Hide the tooltip
    d3.select("#tooltip-radarChart")
        .style("opacity", 0);
}

function getRadarArea(name, hovered_genre) {
    var lineColor;
    var data;

    if (data_index == 0) {
        lineColor = color(name)
        data = data_themes_by_main_genre.filter(function(d) {
            if (d.main_genre == name) {
                return d;
            }
        })
    }
    else if (data_index == 1) {
        lineColor = color(currentLevel)
        data = data_themes_by_specific_genre.filter(function(d) {
            if (d.specific_genre == name) {
                return d;
            }
        })
    }
    else if (data_index == 2) {
        lineColor = color(previousLevel);
        data = data_themes_by_artist.filter(function(d) {
            if (d.artist_name == name) {
                return d;
            }
        })
    }

    addRadarArea(data[0], hovered_genre, lineColor)
}


function addRadarArea(data, hovered_genre, color) {
    // console.log(data);
    let id = "#radarChart";
    let svg = d3
            .select(id)
            .select("svg");

    let line = d3
            .line()
            .x(d => d.x)
            .y(d => d.y);

    let coordinates = getPathCoordinates(data);
    // let values = getPathCoordinates(data);
   ///// Draw the path element /////
    svg
        .append("path")
            .datum(coordinates)
            .attr("d", line)
            .attr("id", "path-hovered_" + hovered_genre)
            .attr("class", "radar-chart-path_" + hovered_genre)
            .attr("stroke-width", 1)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("fill-opacity", radarCfg.shapeOpacity)
            .attr("stroke-opacity", radarCfg.lineOpacity)
            .on("mouseover", highlightRadar)
            .on("mouseleave", doNotHighlightRadar)


    svg
        .append("g")
            .attr("id", "g-hovered_" + hovered_genre)
            .attr("class", "radar-chart-g_" + hovered_genre)
            .attr("fill", color)
            .selectAll("circle")
            .data(coordinates)
            .join("circle")
            .attr("cx", (d) => d["x"])
            .attr("cy", (d) => d["y"])
            .attr("fill-opacity", radarCfg.opacityCircles)
            .attr("r", radarCfg.dotRadius)
}

function searchBar() {
    let artist = document.getElementById("searchbarvalue").value.toLowerCase();
    var artist_color;

    d3
        .select("#searchbar")
        .append('ul');

    let ul = d3
            .select('ul');

    data = data_themes_by_artist.filter(function (d) {
        if (d.artist_name == artist) {

            ///// check if artist already in artist list /////
            let artistInList = false;
            ul.selectAll('li')["_groups"][0].forEach(function(li) {
                try {
                    let text = li.firstChild["data"];
                    if (text == artist) {
                        artistInList = true;
                    }
                }
                catch(err) { }
            })

            ////// add artist name to list //////
            if (!artistInList && ul.selectAll('li')["_groups"][0].length < 5) {
                data_artist_main_genre.filter(function(e) {
                    if (e.artist_name == artist) {
                        artist_color = color(e.main_genre);
                    }
                })
                ul
                    .append('li')
                    .text(d.artist_name)
                    .style('color', _white)
                    .on("click", function() {
                        d3.select(this).remove();
                        d3.selectAll("path.radar-chart-path_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n")).remove();
                        d3.selectAll("g.radar-chart-g_" + artist.replace(/ /g, "").replace("'", "").replace("&", "n")).remove();
                    })
                    
                    .on("mouseover", function() {
                        d3.selectAll("path.radar-chart-path_" + d.artist_name.replace(/ /g,  "").replace("'", "").replace("&", "n"))
                            .classed("radarShapeHighlight", true);
                        d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n"))
                            .moveToFront()
                            .classed("radarDotsHighlight", true);
                    })
                    .on("mouseleave", function() {
                        d3.selectAll("path.radar-chart-path_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n"))
                            .classed("radarShapeHighlight", false);
                        d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n"))
                            .moveToFront()
                            .classed("radarDotsHighlight", false);
                    });
                    return d;
            }
        }
    });

    let id = "#radarChart";
    let svg = d3
            .select(id)
            .select("svg");

    let line = d3
            .line()
            .x(d => d.x)
            .y(d => d.y);

    for (let i = 0; i < data.length; i ++) {
        let d = data[i];
        let coordinates = getPathCoordinates(d);

        ////// Draw the path element //////
        svg
            .append("path")
            .datum(coordinates)
            .attr("d", line)
            .attr("class", "radar-chart-path_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n"))
            .attr("stroke-width", 1)
            .attr("stroke", artist_color)
            .attr("fill",  artist_color)
            .attr("fill-opacity", radarCfg.shapeOpacity)
            .attr("opacity", 0.75)
            .attr("stroke-opacity", radarCfg.lineOpacity)
            .on("mouseover", function() {
                d3.select(this)
                    .moveToFront()
                    .classed("radarShapeHighlight", true);
                d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n"))
                    .moveToFront()
                    .classed("radarDotsHighlight", true);
            })
            .on("mouseleave", function() {
                d3.select(this)
                    .classed("radarShapeHighlight", false);
                d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g, "").replace("'", "").replace("&", "n"))
                    .moveToFront()
                    .classed("radarDotsHighlight", false);
            })

        svg
            .append("g")
            .attr("class", "radar-chart-g_" + artist.replace(/ /g, "").replace("'", "").replace("&", "n"))
            .attr("fill", artist_color)
            .selectAll("circle")
            .data(coordinates)
            .join("circle")
            .attr("cx", (d) => d["x"])
            .attr("cy", (d) => d["y"])
            .attr("fill-opacity", radarCfg.opacityCircles)
            .attr("opacity", 1)
            .attr("r", radarCfg.dotRadius)
            .on("mouseover", highlightRadarDot)
            .on("mouseleave", doNotHighlightRadarDot)
    }
}

function RadarChart(id, data, update) {
    let allAxis = Object.values(attributes),
        totalAttr = allAxis.length;

    var svg;
    if (!update) {
        ////// Initiate the radar chart SVG //////
        svg = d3
                .select(id)
                .append("svg")
                .attr("height", radarCfg.h *1.4)
                .attr("class", id);

        ////// Plotting axes //////
        let ticks = [maxValue / 3, maxValue / 3 * 2, maxValue];

        ticks.forEach(t =>
            svg.append("text")
            .attr("x", radarCfg.margin.left)
            .attr("y", radarCfg.margin.top - rScale(t))
            .text(t.toFixed(2).toString())
            .style("fill", _grey)
            .style("font-size", "11px")
        );

        ticks.forEach(t =>
            svg
                .append("circle")
                .attr("cx", radarCfg.margin.left)
                .attr("cy", radarCfg.margin.top)
                .attr("fill", "none")
                .attr("opacity", radarCfg.gridOpacity)
                .attr("stroke", _grey)
                .attr("r", rScale(t))
        );

        for (let i = 0; i < totalAttr; i++) {
            let at_name = Object.keys(attributes)[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / totalAttr);
            let line_coordinate = angleToCoordinate(angle, maxValue);
            let label_coordinate = angleToCoordinate(angle, maxValue * 1.3 );

            ////// Draw axis line //////
            svg.append("line")
                .attr("x1", radarCfg.margin.left)
                .attr("y1", radarCfg.margin.top)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .style("stroke-opacity", radarCfg.gridOpacity)
                .attr("stroke", _grey)
                .attr("id", "radar-chart-axis_" + attributes[at_name]);

            ////// Draw axis label //////
            svg.append("text")
                .attr("id", "radar-chart-text_" + attributes[at_name])
                .style("font-size", "11px")
                .style("fill", _grey)
                .style("font-family", "Lato")
                .attr("text-anchor", "middle")
                .attr("word-break", "break-all")
                .attr("dy", "0.30em")
                .attr("x", label_coordinate.x)
                .attr("y", label_coordinate.y)
                .text(attributes[at_name])
                .on("mouseover", function() {
                    d3.select(this)
                        changeRadarAxisColor(attributes[at_name], radarCfg.highlightColor)
                        changeParallelCoorAxisColor(attributes[at_name], radarCfg.highlightColor);
                })
                .on("mouseleave", function() {
                    d3.select(this)
                        changeRadarAxisColor(attributes[at_name], radarCfg.defaultColor)
                        changeParallelCoorAxisColor(attributes[at_name], radarCfg.defaultColor);
                })
                .on("click", function() {
                    d3.select(this)
                        clickRadarAxis(id, attributes[at_name])
                        clickParallelCoorAxis("#parallelCoordinates", attributes[at_name])
                        changeAreaEncoding("#circularPacking");
                })
        }
    } else { // if update

        svg = d3
            .select(id)
            .select("svg");

        svg.
            selectAll(".average-path").remove();
        svg.
            selectAll(".average-g").remove();
    }
    // Plotting data
    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    for (let i = 0; i < data.length; i ++) {
        let d = data[i];
        let color = radarCfg.highlightColor;
        let coordinates = getPathCoordinates(d);

        // Draw the path element
        svg
            .append("path") 
                .datum(coordinates)
                .attr("d", line)
                .attr("class", "average-path radar-chart-path_" + i)
                .attr("i", i)
                .attr("stroke-width", 1)
                .attr("stroke", color)
                .attr("fill", color)
                .attr("fill-opacity", radarCfg.shapeOpacity)
                .attr("stroke-opacity", radarCfg.lineOpacity)
                .attr("opacity", radarCfg.opacityCircles)
                .on("mouseover", function() {
                    d3.select(this)
                        .moveToFront()
                        .classed("radarShapeHighlight", true);
                    d3.select(".radar-chart-g_" + d3.select(this).attr("i"))
                        .moveToFront()
                        .classed("radarDotsHighlight", true);
                })
                .on("mouseleave", function() {
                    d3.select(this)
                        .classed("radarShapeHighlight", false);
                    d3.select(".radar-chart-g_" + d3.select(this).attr("i"))
                        .moveToFront()
                        .classed("radarDotsHighlight", false);
                })

        svg
            .append("g")
            .attr("class", "average-g radar-chart-g_" + i)
            .attr("fill", color)
            .selectAll("circle")
            .data(coordinates)
            .join("circle")
            .attr("cx", (d) => d["x"])
            .attr("cy", (d) => d["y"])
            .attr("fill-opacity", radarCfg.opacityCircles)
            .attr("r", radarCfg.dotRadius)
            .on("mouseover", highlightRadarDot)
            .on("mouseleave", doNotHighlightRadarDot)

    }

   
}