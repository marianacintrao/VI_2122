const p = 50;
const t = height / 3 / 2

let radarCfg = {
    w: width,
    h: height / 3 - (p / 2),
    margin: {
        top: t + p,
        right: 0,
        bottom: 0,
        left: width * 5/6
    },
    opacityArea: 0.35,
    dotRadius: 2,
    opacityCircles: 0.9,
    lineOpacity: 0.9,
    lineWidth: 3,
    shapeOpacity: 0.3,
    gridOpacity: 0.3,
    maxValue: 0.4,
    defaultColor: _grey,
    highlightColor: _white
};

let radius = Math.min(radarCfg.w/2, radarCfg.h/2),
    maxValue = radarCfg.maxValue,
    rScale = d3
            .scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

function changeRadarAxisColor(at_name, col) {
    d3.selectAll("#radar-chart-text_" + at_name).style("fill", col);
    d3.selectAll("#radar-chart-axis_" + at_name).attr("stroke", col);
}

function getPathCoordinates(data_point) {
    let coordinates = [];
    let length = Object.keys(attributes).length;
    for (let i = 0; i < length; i++){
        let at_name = Object.keys(attributes)[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / length);
        let value = data_point[at_name];
        coordinates.push(angleToCoordinate(angle, value));
        if (value > maxValue) {
            maxValue = value;
        }
    }
    let at_name = Object.keys(attributes)[0];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / length);
    let value = data_point[at_name];
    coordinates.push(angleToCoordinate(angle, value));
    return coordinates;
}

function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * rScale(value);
    let y = Math.sin(angle) * rScale(value);
    return {"x": radarCfg.margin.left + x, "y": radarCfg.margin.top - y};
}

function addRadarArea(data, hovered_genre, color) {
    let id = "#radarChart";
    let svg = d3
            .select(id)
            .select("svg");

    let line = d3
            .line()
            .x(d => d.x)
            .y(d => d.y);

    let coordinates = getPathCoordinates(data);
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
    let color = radarCfg.defaultColor;

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
                ul.append('li')
                .text(d.artist_name)
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
            .attr("stroke", radarCfg.defaultColor)
            .attr("fill", radarCfg.defaultColor)
            .attr("fill-opacity", radarCfg.shapeOpacity)
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
            .attr("fill", color)
            .selectAll("circle")
            .data(coordinates)
            .join("circle")
            .attr("cx", (d) => d["x"])
            .attr("cy", (d) => d["y"])
            .attr("fill-opacity", radarCfg.opacityCircles)
            .attr("r", radarCfg.dotRadius)
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
                .attr("width",  radarCfg.w)
                .attr("height", radarCfg.h * 1.5)
                .attr("class", id);

        ////// Append a g element //////
        let g = svg
                .append("g")
                .style("padding", radarCfg.h)
                .attr("transform", "translate(" + (radarCfg.margin.left) + "," + (radarCfg.margin.top) + ")");

        ////// Plotting axes //////
        let ticks = [maxValue / 3, maxValue / 3 * 2, maxValue];
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
        }
    }
}