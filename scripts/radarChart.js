var svg;
var g;
var p = 30;

function RadarChart(id, data, update) {

    var cfg = {
        w: document.body.scrollWidth - margin.left - margin.right - p,
        h: document.body.scrollHeight - margin.bottom - margin.top - p,
        margin: { //The margins of the SVG
            top: (document.body.scrollHeight - margin.bottom - margin.top - p) * 0.75, 
            right: 0, 
            bottom: 0, 
            left: (document.body.scrollWidth - margin.left - margin.right - p) - (document.body.scrollWidth - margin.left - margin.right)/5
        },
        opacityArea: 0.35,      
        dotRadius: 3,           
        opacityCircles: 1,    
        lineOpacity: 1,
        lineWidth: 3,
        shapeOpacity: 0.3,
        maxValue: 0.2,
    };

    var maxValue = cfg.maxValue;

    
    var allAxis = Object.values(attributes),	//Names of each axis
        totalAttr = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2);
    
    //Scale for the radius

    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);
    
    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    
    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
            .attr("width",  cfg.w)
            .attr("height", cfg.h * 1.5)
            .attr("class", "radar" + id);

    // //Append a g element		
    // var g = svg.append("g")
    //         .style("padding", cfg.h)
    //         .attr("transform", "translate(" + (cfg.margin.left) + "," + (cfg.margin.top) + ")");

    
    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * rScale(value);
        let y = Math.sin(angle) * rScale(value);
        return {"x": cfg.margin.left + x, "y": cfg.margin.top - y};
    }

    /////////////////////////////////////////////////////
    //////////////////  plotting axes  //////////////////
    /////////////////////////////////////////////////////
    
    let ticks = [maxValue / 3, maxValue / 3 * 2, maxValue];
    ticks.forEach(t =>
        svg.append("circle")
        .attr("cx", cfg.margin.left)
        .attr("cy", cfg.margin.top)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", rScale(t))
        );
        
        
    for (var i = 0; i < totalAttr; i++) {
        let at_name = Object.keys(attributes)[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / totalAttr);
        let line_coordinate = angleToCoordinate(angle, maxValue);
        let label_coordinate = angleToCoordinate(angle, maxValue * 1.3 );
        
        //draw axis line
        svg.append("line")
            .attr("x1", cfg.margin.left)
            .attr("y1", cfg.margin.top)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke", _white);
        
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
    let colors = ["darkorange", "gray", "navy"];


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
        return coordinates;
    }

    for (var i = 0; i < data.length; i ++) {
        let d = data[i];
        let color = colors[0];
        let coordinates = getPathCoordinates(d);
        console.log(coordinates)
    
        //draw the path element
        svg.append("path")
            .datum(coordinates)
            .attr("d",line)
            .attr("stroke-width", 1)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("fill-opacity", cfg.shapeOpacity)
            .attr("stroke-opacity", cfg.lineOpacity)
            
            
        svg
            .append("g")
            .attr("fill", color)
            .selectAll("circle")
            .data(coordinates)
            .join("circle")
            .attr("cx", (d) => d["x"])
            .attr("cy", (d) => d["y"])
            .attr("fill-opacity", cfg.opacityCircles)
            .attr("r", cfg.dotRadius)
    }
    
}