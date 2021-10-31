const p = 50;
const t = height / 3 / 2
var radarCfg = {
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
    highlightColor: _white,
};

// function addRadarArea(data, artist) {
//         console.log(data.main_genre)

//         var rScale = d3
//             .scaleLinear()
//             .range([0, radius])
//             .domain([0, maxValue]);

//         var radius = Math.min(radarCfg.w/2, radarCfg.h/2),
//             maxValue = radarCfg.maxValue;

//         function angleToCoordinate(angle, value){
//             let x = Math.cos(angle) * rScale(value);
//             let y = Math.sin(angle) * rScale(value);
//             return {"x": radarCfg.margin.left + x, "y": radarCfg.margin.top - y};
//         }

//         function getPathCoordinates(data_point) {
//             let coordinates = [];
//             let length = Object.keys(attributes).length;
//             for (var i = 0; i < length; i++){
//                 let at_name = Object.keys(attributes)[i];
//                 let angle = (Math.PI / 2) + (2 * Math.PI * i / length);
//                 let value = data_point[at_name];
//                 coordinates.push(angleToCoordinate(angle, value));
//                 if (value > maxValue) {
//                     maxValue = value;
//                 }
//             }
//             let at_name = Object.keys(attributes)[0];
//             let angle = (Math.PI / 2) + (2 * Math.PI * i / length);
//             let value = data_point[at_name];
//             coordinates.push(angleToCoordinate(angle, value));
//             return coordinates;
//         }
//         // let d = data[key];
//         // console.log("--------------------------------");
//         // console.log(d.main_genre);
//         //if (d.main_genre != name) {continue;}
//         let coordinates = getPathCoordinates(data);

//         var id = "#radarChart";
//         var svg = d3
//                 .select(id)
//                 .select("svg");

//         let line = d3
//             .line()
//             .x(d => d.x)
//             .y(d => d.y);

//         // Draw the path element
//         svg
//             .append("path")
//             .datum(coordinates)
//             .attr("d", line)
//             .attr("class", "path_" + artist)
//             .attr("stroke-width", 1)
//             .attr("stroke", radarCfg.defaultColor)
//             .attr("fill", radarCfg.defaultColor)
//             .attr("fill-opacity", radarCfg.shapeOpacity)
//             .attr("stroke-opacity", radarCfg.lineOpacity)
//             .on("mouseover", function() {
//                 d3.select(this)
//                     .moveToFront()
//                     .classed("radarShapeHighlight", true);                
//             })
//             .on("mouseleave", function() {
//                 d3.select(this)
//                     .classed("radarShapeHighlight", false);                
//             })

//         svg
//             .append("g")
//             .attr("class", "g_" + data.main_genre)
//             .attr("fill", radarCfg.defaultColor)
//             .selectAll("circle")
//             .data(coordinates)
//             .attr("class", "circle_" + data.main_genre)
//             .join("circle")
//             .attr("cx", (d) => d["x"])
//             .attr("cy", (d) => d["y"])
//             .attr("fill-opacity", radarCfg.opacityCircles)
//             .attr("r", radarCfg.dotRadius) 
// }

function changeRadarAxisColor(at_name, col) {
    d3.selectAll("#radar-chart-text_" + at_name).style("fill", col);
    d3.selectAll("#radar-chart-axis_" + at_name).attr("stroke", col);
}

function addRadarArea(data, hovered_genre, color) {
    // let color = radarCfg.defaultColor;

    var radius = Math.min(radarCfg.w/2, radarCfg.h/2),
    maxValue = radarCfg.maxValue;

    var rScale = d3
            .scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * rScale(value);
        let y = Math.sin(angle) * rScale(value);
        return {"x": radarCfg.margin.left + x, "y": radarCfg.margin.top - y};
    }

    var id = "#radarChart";
    var svg = d3
            .select(id)
            .select("svg");

    let line = d3
            .line()
            .x(d => d.x)
            .y(d => d.y);

    function getPathCoordinates(data_point) {
        let coordinates = [];
        let length = Object.keys(attributes).length;
        for (var i = 0; i < length; i++){
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

    var coordinates = getPathCoordinates(data);
    // Draw the path element
    svg
        .append("path")
        .datum(coordinates)
        .attr("d", line)
        .attr("id", "path-hovered_" + hovered_genre)
        .attr("class", "path_" + hovered_genre)
        .attr("stroke-width", 1)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("fill-opacity", radarCfg.shapeOpacity)
        .attr("stroke-opacity", radarCfg.lineOpacity)
        .on("mouseover", function() {
            d3.select(this)
                .moveToFront()
                .classed("radarShapeHighlight", true);                
        })
        .on("mouseleave", function() {
            d3.select(this)
                .classed("radarShapeHighlight", false);                
        })

    svg
        .append("g")
        .attr("class", "g_" + hovered_genre)
        .attr("id", "g-hovered_" + hovered_genre)
        .attr("fill", color)
        .selectAll("circle")
        .data(coordinates)
        // .attr("class", "circle_" + artist)
        .join("circle")
        .attr("cx", (d) => d["x"])
        .attr("cy", (d) => d["y"])
        .attr("fill-opacity", radarCfg.opacityCircles)
        .attr("r", radarCfg.dotRadius)

}

function searchBar() {
    var artist = document.getElementById("searchbarvalue").value.toLowerCase();
    let color = radarCfg.defaultColor;

    // Find list
    d3
        .select("#searchbar")
        .append('ul');

    var ul = d3
            .select('ul');

    var radius = Math.min(radarCfg.w/2, radarCfg.h/2),
        maxValue = radarCfg.maxValue;

    var rScale = d3
            .scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * rScale(value);
        let y = Math.sin(angle) * rScale(value);
        return {"x": radarCfg.margin.left + x, "y": radarCfg.margin.top - y};
    }

    data = data_themes_by_artist.filter(function (d) {
        if (d.artist_name == artist) {
            ul.append('li')
            .text(d.artist_name)
            .style('color', _white)
            .on("click", function() {
                d3.select(this).remove();
                d3.selectAll("path.path_" + d.artist_name.replace(/ /g,".")).remove();
                d3.selectAll("g.g_" + d.artist_name.replace(/ /g,".")).remove();
                
            })
            .on("mouseover", function() {
                d3.selectAll("path.path_" + d.artist_name.replace(/ /g,"."))
                    .classed("radarShapeHighlight", true);                
                
            })
            .on("mouseleave", function() {
                d3.selectAll("path.path_" + d.artist_name.replace(/ /g,"."))
                    .classed("radarShapeHighlight", false);                
            });
            return d;
        }
    });

    var id = "#radarChart";
    var svg = d3
            .select(id)
            .select("svg");

    let line = d3
            .line()
            .x(d => d.x)
            .y(d => d.y);

    function getPathCoordinates(data_point) {
        let coordinates = [];
        let length = Object.keys(attributes).length;
        for (var i = 0; i < length; i++){
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

    for (var i = 0; i < data.length; i ++) {
        let d = data[i];
        let coordinates = getPathCoordinates(d);

        // Draw the path element
        svg
            .append("path")
            .datum(coordinates)
            .attr("d", line)
            .attr("class", "path_" + artist)
            .attr("stroke-width", 1)
            .attr("stroke", radarCfg.defaultColor)
            .attr("fill", radarCfg.defaultColor)
            .attr("fill-opacity", radarCfg.shapeOpacity)
            .attr("stroke-opacity", radarCfg.lineOpacity)
            .on("mouseover", function() {
                d3.select(this)
                    .moveToFront()
                    .classed("radarShapeHighlight", true);                
            })
            .on("mouseleave", function() {
                d3.select(this)
                    .classed("radarShapeHighlight", false);                
            })

        svg
            .append("g")
            .attr("class", "g_" + artist)
            .attr("fill", color)
            .selectAll("circle")
            .data(coordinates)
            // .attr("class", "circle_" + artist)
            .join("circle")
            .attr("cx", (d) => d["x"])
            .attr("cy", (d) => d["y"])
            .attr("fill-opacity", radarCfg.opacityCircles)
            .attr("r", radarCfg.dotRadius)
    }
}

function RadarChart(id, data, update) {
    if (!update) {
        var allAxis = Object.values(attributes),
        totalAttr = allAxis.length,
        radius = Math.min(radarCfg.w/2, radarCfg.h/2),
        maxValue = radarCfg.maxValue;

        //Scale for the radius
        var rScale = d3
                .scaleLinear()
                .range([0, radius])
                .domain([0, maxValue]);

        //Initiate the radar chart SVG
        var svg = d3
                .select(id)
                .append("svg")
                .attr("width",  radarCfg.w)
                .attr("height", radarCfg.h * 1.5)
                .attr("class", id);

        //Append a g element
        var g = svg.append("g")
                .style("padding", radarCfg.h)
                .attr("transform", "translate(" + (radarCfg.margin.left) + "," + (radarCfg.margin.top) + ")");

        function angleToCoordinate(angle, value){
            let x = Math.cos(angle) * rScale(value);
            let y = Math.sin(angle) * rScale(value);
            return {"x": radarCfg.margin.left + x, "y": radarCfg.margin.top - y};
        }

        // Plotting axes
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

        for (var i = 0; i < totalAttr; i++) {
            let at_name = Object.keys(attributes)[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / totalAttr);
            let line_coordinate = angleToCoordinate(angle, maxValue);
            let label_coordinate = angleToCoordinate(angle, maxValue * 1.3 );

            // Draw axis line
            svg.append("line")
                .attr("x1", radarCfg.margin.left)
                .attr("y1", radarCfg.margin.top)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .style("stroke-opacity", radarCfg.gridOpacity)
                .attr("stroke", _grey)
                .attr("id", "radar-chart-axis_" + attributes[at_name]);
        
            // Draw axis label
            svg.append("text")
                .attr("id", "radar-chart-text_" + attributes[at_name])
                .style("font-size", "11px")
                .style("fill", _grey)
                .style("font-family", "Lucida Console")
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

        function getPathCoordinates(data_point){
            let coordinates = [];
            let length = Object.keys(attributes).length;
            for (var i = 0; i < length; i++){
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

        for (var i = 0; i < data.length; i ++) {
            let d = data[i];
            let color = radarCfg.defaultColor;
            let coordinates = getPathCoordinates(d);

            // Draw the path element
            svg
                .append("path")
                .datum(coordinates)
                .attr("d",line)
                .attr("stroke-width", 1)
                .attr("stroke", color)
                .attr("fill", color)
                .attr("fill-opacity", radarCfg.shapeOpacity)
                .attr("stroke-opacity", radarCfg.lineOpacity)
                .on("mouseover", function() {
                    d3.select(this)
                        .moveToFront()
                        .classed("radarShapeHighlight", true);                
                    })
                    
                .on("mouseleave", function() {
                    d3.select(this)
                        .classed("radarShapeHighlight", false);                

                })

            svg
                .append("g")
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