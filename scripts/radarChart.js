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
    shapeOpacity: 0.3,
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
    console.log("from radar: " + currentTheme)
    
    // change axis color to highlighted
    changeRadarAxisColor(at_name, radarCfg.highlightColor)

    // this axis clicked = true
    d3.selectAll("#radar-chart-axis_" + at_name).classed("clicked", true)

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
    d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g,"."))
        .moveToFront()
        .classed("radarDotsHighlight", true);
}
const doNotHighlightRadar = function(event, d) {  
    d3.select(this)
        .classed("radarShapeHighlight", false);
    d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g,"."))
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


function addRadarArea(data, hovered_genre, color) {
    console.log(data)
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

    // let color = radarCfg.defaultColor;
    var artist_color;

    ////// Find list
    d3
        .select("#searchbar")
        .append('ul');

    let ul = d3
            .select('ul');

    // let radius = Math.min(radarCfg.w/2, radarCfg.h/2),
    //     maxValue = radarCfg.maxValue;

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
            if (!artistInList) {
                num_artist_areas += 1;

                console.log(d.main_genre)
                artist_color = color(d.main_genre)

                ul.append('li')
                .text(d.artist_name)
                    // .style('color', radarColors[num_artist_areas%5])
                    .style('color', _white)
                    .on("click", function() {
                        d3.select(this).remove();
                        d3.selectAll("path.radar-chart-path_" + d.artist_name.replace(/ /g,".")).remove();
                        d3.selectAll("g.radar-chart-g_" + artist.replace(/ /g,".")).remove();
                    })
                    
                    .on("mouseover", function() {
                        d3.selectAll("path.radar-chart-path_" + d.artist_name.replace(/ /g,"."))
                            .classed("radarShapeHighlight", true);
                        d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g,"."))
                            .moveToFront()
                            .classed("radarDotsHighlight", true);
                    })
                    .on("mouseleave", function() {
                        d3.selectAll("path.radar-chart-path_" + d.artist_name.replace(/ /g,"."))
                            .classed("radarShapeHighlight", false);
                        d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g,"."))
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
            .attr("class", "radar-chart-path_" + d.artist_name)
            .attr("stroke-width", 1)
            .attr("stroke", artist_color)
            .attr("fill",  artist_color)
            .attr("fill-opacity", radarCfg.shapeOpacity)
            .attr("opacity", 0.5)
            .attr("stroke-opacity", radarCfg.lineOpacity)
            .on("mouseover", function() {
                d3.select(this)
                    .moveToFront()
                    .classed("radarShapeHighlight", true);
                d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g,"."))
                    .moveToFront()
                    .classed("radarDotsHighlight", true);
            })
            .on("mouseleave", function() {
                d3.select(this)
                    .classed("radarShapeHighlight", false);
                d3.select(".radar-chart-g_" + d.artist_name.replace(/ /g,"."))
                    .moveToFront()
                    .classed("radarDotsHighlight", false);
            })

        svg
            .append("g")
            .attr("class", "radar-chart-g_" + artist)
            .attr("fill", artist_color)
            .selectAll("circle")
            .data(coordinates)
            .join("circle")
            .attr("cx", (d) => d["x"])
            .attr("cy", (d) => d["y"])
            .attr("fill-opacity", radarCfg.opacityCircles)
            .attr("opacity", 0.5)
            .attr("r", radarCfg.dotRadius)
            .on("mouseover", highlightRadarDot)
            .on("mouseleave", doNotHighlightRadarDot)
    }
}

function RadarChart(id, data, update) {
    if (!update) {
        let allAxis = Object.values(attributes),
            totalAttr = allAxis.length;

        ////// Initiate the radar chart SVG //////
        let svg = d3
                .select(id)
                .append("svg")
                // .attr("width",  "30%")
                .attr("height", radarCfg.h *1.4)
                // .attr ()
                .attr("class", id);

        ////// Append a g element //////
        let g = svg
                .append("g")
                .style("padding", radarCfg.h)
                // .attr("transform", "translate(" + (radarCfg.margin.left) + "," + (radarCfg.margin.top) + ")");

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
                        //console.log("index", data_index);
                        changeAreaEncoding("#circularPacking");
                })
        }

        // Plotting data
        let line = d3.line()
            .x(d => d.x)
            .y(d => d.y);

        for (let i = 0; i < data.length; i ++) {
            let d = data[i];
            let color = radarCfg.defaultColor;
            let coordinates = getPathCoordinates(d);

            // Draw the path element
            svg
                .append("path") 
                    .datum(coordinates)
                    .attr("d", line)
                    .attr("class", "radar-chart-path_" + i)
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
                .attr("class", "radar-chart-g_" + i)
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
}