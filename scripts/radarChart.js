const p = 30;
// var id;

var radarCfg = {
    w: width - p,
    h: height / 3.5,
    margin: {
        top: height / 5,
        // top: (document.body.scrollHeight - margin.bottom - margin.top - p) * 0.75,
        right: 0,
        bottom: 0,
        left: width * 5/6
        // left: (document.body.scrollWidth - margin.left - margin.right - p) - (document.body.scrollWidth - margin.left - margin.right)/5
    },
    opacityArea: 0.35,
    dotRadius: 2,
    opacityCircles: 0.9,
    lineOpacity: 0.9,
    lineWidth: 3,
    shapeOpacity: 0.3,
    gridOpacity: 0.3,
    maxValue: 0.2, 
    defaultColor: _white,
};

function searchBar() {
    var artist = document.getElementById("searchbarvalue").value.toLowerCase();

    var radius = Math.min(radarCfg.w/2, radarCfg.h/2),
        maxValue = radarCfg.maxValue;


    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * rScale(value);
        let y = Math.sin(angle) * rScale(value);
        return {"x": radarCfg.margin.left + x, "y": radarCfg.margin.top - y};
    }

    data = data_themes_by_artist.filter(function (d) {
        if (d.artist_name == artist) {
            return d;
        }
    });

    console.log(data);

    //Initiate the radar chart SVG

    var id = "#radarChart";
    var svg = d3.select(id).select("svg");

    let line = d3.line()
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
        let color = radarCfg.defaultColor;
        let coordinates = getPathCoordinates(d);
        console.log(coordinates);
        //draw the path element
        svg.append("path")
            .datum(coordinates)
            .attr("d", line)
            .attr("class", "path_" + artist)
            .attr("stroke-width", 1)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("fill-opacity", radarCfg.shapeOpacity)
            .attr("stroke-opacity", radarCfg.lineOpacity)
            .on("mouseover", function() {
                d3.select(this).style("fill", "red");
            })
            .on("mouseleave", function() {
                d3.select(this).style("fill", color);
            })
            
            svg
            .append("g")
            .attr("fill", color)
            .selectAll("circle")
            .data(coordinates)
            .attr("class", "circle_" + artist)
            .join("circle")
            .attr("cx", (d) => d["x"])
            .attr("cy", (d) => d["y"])
            .attr("fill-opacity", radarCfg.opacityCircles)
            .attr("r", radarCfg.dotRadius)
    }
}


function RadarChart(id, data, update) {
    
    if (!update) {
        var allAxis = Object.values(attributes),	//Names of each axis
        totalAttr = allAxis.length,					//The number of different axes
        radius = Math.min(radarCfg.w/2, radarCfg.h/2),
        maxValue = radarCfg.maxValue;
    
        //Scale for the radius
        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);
    
        /////////////////////////////////////////////////////////
        //////////// Create the container SVG and g /////////////
        /////////////////////////////////////////////////////////
    
    
        //Initiate the radar chart SVG
        var svg = d3.select(id).append("svg")
                .attr("width",  radarCfg.w)
                .attr("height", radarCfg.h * 1.5)
                .attr("class", id);
    
        // //Append a g element
        // var g = svg.append("g")
        //         .style("padding", radarCfg.h)
        //         .attr("transform", "translate(" + (radarCfg.margin.left) + "," + (radarCfg.margin.top) + ")");
    
    
        function angleToCoordinate(angle, value){
            let x = Math.cos(angle) * rScale(value);
            let y = Math.sin(angle) * rScale(value);
            return {"x": radarCfg.margin.left + x, "y": radarCfg.margin.top - y};
        }
    
        /////////////////////////////////////////////////////
        //////////////////  plotting axes  //////////////////
        /////////////////////////////////////////////////////
    
        let ticks = [maxValue / 3, maxValue / 3 * 2, maxValue];
        ticks.forEach(t =>
            svg.append("circle")
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
    
            //draw axis line
            svg.append("line")
                .attr("x1", radarCfg.margin.left)
                .attr("y1", radarCfg.margin.top)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .style("stroke-opacity", radarCfg.gridOpacity)
                .attr("stroke", _grey);
    
            //draw axis label
            svg.append("text")
                .style("font-size", "11px")
                .style("fill", _white)
                .style("font-family", "Lucida Console")
                .attr("text-anchor", "middle")
                .attr("word-break", "break-all")
                .attr("dy", "0.30em")
                .attr("x", label_coordinate.x)
                .attr("y", label_coordinate.y)
                .text(attributes[at_name]);
        }
    
    
        /////////////////////////////////////////////////////
        //////////////////  plotting data  //////////////////
        /////////////////////////////////////////////////////
    
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
    
            //draw the path element
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
                    d3.select(this).style("fill", "red");
                })
                .on("mouseleave", function() {
                    d3.select(this).style("fill", color);
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