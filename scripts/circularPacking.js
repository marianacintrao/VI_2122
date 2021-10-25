var svg = d3
    .select("#circularPacking")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    // width = +svg.attr("width"),
    // height = +svg.attr("height"),
    // margin = 20,//www .d e  mo 2  s .  co  m
    
var diameter = +svg.attr("width");

var format = d3.format(",d");

var color = d3
    .scaleSequential(d3.interpolateMagma)
    .domain([-4, 4]);

var stratify = d3
    .stratify()
    .parentId(function(d) {
        return d.id.substring(0, d.id.lastIndexOf("."));
    });

var pack = d3
    .pack()
    //.size([width - 2, height - 2])
    .size([diameter - margin, diameter - margin])
    .padding(2);

// var selectNode = "GOOGLE";
var margin1 = 20;
var nodecircles;

    // jsfiddle: instead of this....
    // d3.csv.parse(data) {
    //   if (error) throw error;
    // var data = d3.csvParse("datasets/default_themes_by_main_genre.csv");
    // var data = d3.csvParse("datasets/themes_by_main_genre.csv").then(function(data) { 
    // console.log(data);
    // });

    // var root;
    // d3.csv("datasets/default_themes_by_specific_genre.csv", function(data) {
    //     console.log(data);
    //     root = stratify(data)
    //         .sum(function(d) {
    //             return d.specific_genre;
    //         });
    //     pack(root);
        
    // });
var root;
d3.csv("datasets/default_themes_by_specific_genrecopy.csv").then(function(data) {
    //var links = d3.csvParse(data);

    // childColumn = "child";
    childColumn = data.columns[1];

    // parentColumn = "parent";
    parentColumn = data.columns[0];

    stratify = d3.stratify()
        .id(d => d[childColumn])
        .parentId(d => d[parentColumn]);

        console.log(data);
    root = stratify(data);
    console.log(root);

    var node = svg
        .select("g")
        .selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        //.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")")
        .attr("class", function(d) {
            return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root");
        })
        .each(function(d) {
            d.node = this;
        })
        .on("click", function(d) {
            if (focus !== d) zoom(d), d3.event.stopPropagation();
        });

    node.append("circle")
        .attr("id", function(d) {
            return "node-" + d.id;
        })
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d) {
            return color(d.depth);
        });
    
        var leaf = node.filter(function(d) {
            return !d.children;
        });
        
    leaf.append("clipPath")
        .attr("id", function(d) {
            return "clip-" + d.id;
        })
        .append("use")
        .attr("xlink:href", function(d) {
            return "#node-" + d.id + "";
        });

    leaf.append("text")
        .attr("clip-path", function(d) {
            return "url(#clip-" + d.id + ")";
        })
        .selectAll("tspan")
        .data(function(d) {
            var txt = d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g);
            return txt
        })
        .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) {
            return 13 + (i - nodes.length / 2 - 0.5) * 10;
        })
        .text(function(d) {
            return d;
        });
        
    node.append("title")
        .text(function(d) {
            return d.id + "\n" + format(d.value);
        });
            // start the zoom. Merged code from Zoomable circle packing
            //     https://bl.ocks.org/mbostock/7607535
    var focus = root,
    view;
        // the definition of "node" differs between the two D3 blocks
        //(circle packing & zoomable circle packing -
        //replace "node" with "nodecircles" if the "node" deifnition
        //needs to be changed for zoomTo() to function)
    svg.select("g").attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
    // zoomTo([root.x, root.y, root.r * 2 + margin1]);
});  // end of main function drawTable.
        
//these two functions zoom() and zoomTo() were inside the "ds.csv" block
function zoom(d) {
    var focus0 = focus;
    focus = d;
    var transition = d3
        .transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) {
                zoomTo(i(t));
            };
        });
    
    transition
        .selectAll("text")
        .filter(function(d) {
            return d.parent === focus || this.style.display === "inline";
        })
        .style("fill-opacity", function(d) {
            return d.parent === focus ? 1 : 0;
        })
        .on("start", function(d) {
            if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function(d) {
            if (d.parent !== focus) this.style.display = "none";
        });
}

function zoomTo(v) {
    nodecircles = svg
        .select("g")
        .selectAll("g")
    circle = svg.selectAll("circle");
    var k = diameter / v[2]; view = v;
    nodecircles.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
}

// commented out: not needed for jsfiddle because d3.csv is not reading a file
//        }); // end of d3.csv block
// drawTable()