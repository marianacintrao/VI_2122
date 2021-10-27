var p = 30;

var svg;
var g;

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
        levels: 0,              //How many levels or inner circles should there be drawn
        labelFactor: 1.4,       //How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60,          //The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35,      //The opacity of the area of the blob
        dotRadius: 2,           //The size of the colored circles of each blog
        // opacityCircles: 0.1,    //The opacity of the circles of each blob
        lineOpacity: 0.3,
        lineWidth: 3,
        strokeWidth: lineWidth,         //The width of the stroke around each blob
        strokeOpacity: lineOpacity,
        roundStrokes: false,    //If true the area and stroke will follow a round path (cardinal-closed)
        maxValue: 1,
        color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
    };
    
    var allAxis = Object.values(attributes),
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        Format = d3.format('.2'),			 	//Percentage formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    if (!update) {
        
        //Scale for the radius
        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, 1]);
            
        /////////////////////////////////////////////////////////
        //////////// Create the container SVG and g /////////////
        /////////////////////////////////////////////////////////
            
        //Initiate the radar chart SVG
        svg = d3.select(id).append("svg")
                // .style("position", "absolute")
                .attr("width",  cfg.w)
                .attr("height", cfg.h * 1.5)
                .attr("class", "radar" + id);
        
                //Append a g element		
        g = svg.append("g")
                .style("padding", cfg.h)
                .attr("transform", "translate(" + (cfg.margin.left) + "," + (cfg.margin.top) + ")");
        
        //Wrapper for the grid & axes
        var axisGrid = g.append("g").attr("class", "axisWrapper");

        /////////////////////////////////////////////////////////
        //////////////////// Draw the axes //////////////////////
        /////////////////////////////////////////////////////////
        
        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");
        
        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function(d, i) { return rScale(cfg.maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("y2", function(d, i) { return rScale(cfg.maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
            .attr("class", "line")
            .style("stroke", _grey)
            .style("stroke-width", lineWidth/4)
            .style("stroke-width", cfg.strokeWidth)
            .style("opacity", cfg.strokeOpacity);

        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .style("fill", _white)
            .style("font-family", "Lucida Console")
            .attr("text-anchor", "middle")
            .attr("word-break", "break-all")
            .attr("dy", "0.30em")
            .attr("x", function(d, i) { return rScale(cfg.maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("y", function(d, i) { return rScale(cfg.maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
            .text(function(d) { return d })
            .call(wrap, cfg.wrapWidth);

        }
    // Object.values(data).forEach(function (value) {
    //     console.log(value);
    // });
    // return rScale(d.{attributes} })
    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////
    
    //The radial line function
    var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function(d) { 
            return rScale(d); })
        .angle(function(d,i) { return i*angleSlice; });
        
    if (cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed");
    }
                
    //Create a wrapper for the blobs	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");
            
    //Append the backgrounds	
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1); 
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);	
        })
        .on('mouseout', function(){
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });
        
    //Create the outlines	
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) {
            return radarLine(Object.values(d));
        })
        .style("stroke-width", cfg.strokeWidth)
        .style("opacity", cfg.strokeOpacity)
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)");
    
    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function(d) {
            return Object.values(d);
        })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", function(d,i,j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////
    
    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");
        
    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d) { 
            return d; 
        })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1)
        .attr("cx", function(d,i) { return rScale(d) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i) { return rScale(d) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 10;
                    
            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(Format(attributes[d]))
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function(){
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });
        
    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    // Wraps SVG text	
    var w = cfg.w
    function wrap(text, w) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
                
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }

	////////////////////////////////////////////
	/////////// Initiate legend ////////////////
	////////////////////////////////////////////

	var svg = d3
        .select('#body')
        .selectAll('svg')
        .append('svg')
        .attr("width", cfg.w + 300)
        .attr("height", cfg.h)

	//Create the title for the legend
	var text = svg
        .append("text")
        .attr("class", "title")
        .attr('transform', 'translate(90,0)') 
        .attr("x", cfg.w - 70)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", _white)
        .text("What % of owners use a specific service in a week");

	//Initiate Legend	
	var legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)');
	
    //Create colour squares
	legend
        .selectAll('rect')
        .data(data.main_genre)
        .enter()
        .append("rect")
        .attr("x", cfg.w - 65)
        .attr("y", function(d, i){ return i * 20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i){ return colorscale(i);});
	
    //Create text next to squares
	legend
        .selectAll('text')
        .data(data.main_genre)
        .enter()
        .append("text")
        .attr("x", cfg.w - 52)
        .attr("y", function(d, i){ return i * 20 + 9;})
        .attr("font-size", "11px")
        .attr("fill", _white)
        .text(function(d) { return d; });
}