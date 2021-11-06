function CircularPacking(id, data) {
    var svg = d3.select(id).select("svg"),
        margin1 = 20,
        diameter = 400,
        g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    // svg.append('svg:defs').append('svg:marker')
    //     .attr('id', 'head')
    //     .attr('orient', 'auto')
    //     .attr('markerWidth', '2')
    //     .attr('markerHeight', '4')
    //     .attr('refX', '0.1')
    //     .attr('refY', '2')
    //     .append('marker:polygon').attr('points', '0,0 0,4 2,2').attr('fill', 'red');

    var color1 = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([diameter - margin1, diameter - margin1])
        .radius(function(d) {
            return d.theme_weight;
        })
        .padding(2);

    // var root = {
    // "name": "flare",
    // "children": [{
    //     "name": "analytics",
    //     "children": [{
    //     "name": "cluster",
    //     "children": [{
    //         "name": "AgglomerativeCluster",
    //         "size": 3938
    //     }, {
    //         "name": "CommunityStructure",
    //         "size": 3812
    //     }]
    //     }, {
    //     "name": "graph",
    //     "children": [{
    //         "name": "BetweennessCentrality",
    //         "size": 3534
    //     }]
    //     }, {
    //     "name": "optimization",
    //     "children": [{
    //         "name": "AspectRatioBanker",
    //         "size": 7074
    //     }]
    //     }]
    // }, {
    //     "name": "animate",
    //     "children": [{
    //     "name": "Easing",
    //     "size": 17010
    //     }, {
    //     "name": "FunctionSequence",
    //     "size": 5842
    //     }, {
    //     "name": "interpolate",
    //     "children": [{
    //         "name": "ArrayInterpolator",
    //         "size": 1983
    //     }, {
    //         "name": "ColorInterpolator",
    //         "size": 2047
    //     }]
    //     }, {
    //     "name": "Parallel",
    //     "size": 5176
    //     }]
    // }, {
    //     "name": "data",
    //     "children": [{
    //     "name": "converters",
    //     "children": [{
    //         "name": "Converters",
    //         "size": 721
    //     }]
    //     }, {
    //     "name": "DataField",
    //     "size": 1759
    //     }]
    // }, {
    //     "name": "display",
    //     "children": [{
    //     "name": "DirtySprite",
    //     "size": 8833
    //     }, {
    //     "name": "LineSprite",
    //     "size": 1732
    //     }]
    // }, {
    //     "name": "flex",
    //     "children": [{
    //     "name": "FlareVis",
    //     "size": 4116
    //     }]
    // }, {
    //     "name": "physics",
    //     "children": [{
    //     "name": "DragForce",
    //     "size": 1082
    //     }, {
    //     "name": "GravityForce",
    //     "size": 1336
    //     }]
    // }, {
    //     "name": "query",
    //     "children": [{
    //     "name": "AggregateExpression",
    //     "size": 1616
    //     }, {
    //     "name": "And",
    //     "size": 1027
    //     }, {
    //     "name": "methods",
    //     "children": [{
    //         "name": "add",
    //         "size": 593
    //     }]
    //     }, {
    //     "name": "Minimum",
    //     "size": 843
    //     }]
    // }, {
    //     "name": "util",
    //     "children": [{
    //     "name": "Arrays",
    //     "size": 8258
    //     }, {
    //     "name": "Colors",
    //     "size": 10001
    //     }, {
    //     "name": "heap",
    //     "children": [{
    //         "name": "FibonacciHeap",
    //         "size": 9354
    //     }, {
    //         "name": "HeapNode",
    //         "size": 1233
    //     }]
    //     }]
    // }, {
    //     "name": "vis",
    //     "children": [{
    //     "name": "axis",
    //     "children": [{
    //         "name": "Axes",
    //         "size": 1302
    //     }, {
    //         "name": "Axis",
    //         "size": 24593
    //     }]
    //     }, {
    //     "name": "controls",
    //     "children": [{
    //         "name": "AnchorControl",
    //         "size": 2138
    //     }, {
    //         "name": "ClickControl",
    //         "size": 3824
    //     }]
    //     }, {
    //     "name": "data",
    //     "children": [{
    //         "name": "Data",
    //         "size": 20544
    //     }, {
    //         "name": "render",
    //         "root": true,
    //         "children": [{
    //         "name": "ArrowType",
    //         "size": 698
    //         }, {
    //         "name": "EdgeRenderer",
    //         "size": 5569
    //         }]
    //     }]
    //     }, {
    //     "name": "events",
    //     "children": [{
    //         "name": "DataEvent",
    //         "size": 2313
    //     }, {
    //         "name": "SelectionEvent",
    //         "size": 1880
    //     }]
    //     }, {
    //     "name": "legend",
    //     "children": [{
    //         "name": "Legend",
    //         "size": 20859
    //     }, {
    //         "name": "LegendItem",
    //         "size": 4614
    //     }]
    //     }, {
    //     "name": "operator",
    //     "children": [{
    //         "name": "distortion",
    //         "children": [{
    //         "name": "BifocalDistortion",
    //         "size": 4461
    //         }, {
    //         "name": "Distortion",
    //         "size": 6314
    //         }]
    //     }, {
    //         "name": "encoder",
    //         "children": [{
    //         "name": "ColorEncoder",
    //         "size": 3179
    //         }, {
    //         "name": "Encoder",
    //         "size": 4060
    //         }]
    //     }, {
    //         "name": "filter",
    //         "children": [{
    //         "name": "FisheyeTreeFilter",
    //         "size": 5219
    //         }, {
    //         "name": "GraphDistanceFilter",
    //         "size": 3165
    //         }]
    //     }, {
    //         "name": "IOperator",
    //         "size": 1286
    //     }, {
    //         "name": "label",
    //         "children": [{
    //         "name": "Labeler",
    //         "size": 9956
    //         }, {
    //         "name": "RadialLabeler",
    //         "size": 3899
    //         }]
    //     }, {
    //         "name": "layout",
    //         "children": [{
    //         "name": "AxisLayout",
    //         "size": 6725
    //         }, {
    //         "name": "BundledEdgeRouter",
    //         "size": 3727
    //         }]
    //     }, {
    //         "name": "Operator",
    //         "size": 2490
    //     }, {
    //         "name": "OperatorList",
    //         "size": 5248
    //     }]
    //     }, {
    //     "name": "Visualization",
    //     "size": 16540
    //     }]
    // }]
    // };

    // console.log(root);
    // console.log("/////////////////");
    root = data;
    console.log(root);
    
    root = d3.hierarchy(root)
        .sum(function(d) {
            return d.theme_weight;
        })
        .sort(function(a, b) {
            return b.value - a.value;
        });

    var focus = root,
        nodes = pack(root).descendants(),
        view;

    var circle = g.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function(d) {
            return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
        })
        .style("fill", function(d) {
            return d.children ? color1(d.depth) : null;
        })
        .on("click", function(event, d) {
            if (focus !== d) zoom(event, d), event.stopPropagation();
        });

    var text = g.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) {
            return d.parent === root ? 1 : 0;
        })
        .style("display", function(d) {
            return d.parent === root ? "inline" : "none";
        })
        .text(function(d) {
            return d.data.name;
        });

    var node = g.selectAll("circle,text");

    svg
        .style("background", color1(-1))
        .on("click", function(event) {
            zoom(event, root);
        });

    console.log(root.x, root.y, root.r);
    zoomTo([root.x, root.y, root.r * 2 + margin1]);
    var activeNode = root;

    function zoom(event, d) {
        var focus0 = focus;
        focus = d;
        activeNode = d;
        var transition = d3.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin1]);
                return function(t) {
                    zoomTo(i(t));
                };
            });

        transition
            .selectAll("text")
            .filter(function() {
                return d.parent === focus || this.style.display === "inline";
            })
            .style("fill-opacity", function() {
                return d.parent === focus ? 1 : 0;
            })
            .on("start", function() {
                if (d.parent === focus) this.style.display = "inline";
            })
            .on("end", function() {
                if (d.parent !== focus) this.style.display = "none";
            });
    }

    function zoomTo(v) {
        var k = diameter / v[2];
        view = v;
        node.attr("transform", function(d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        circle.attr("r", function(d) {
            return d.r * k;
        });
        // if (activeNode) {
            // g.selectAll("path").remove();
            // g.selectAll("path").data(activeNode.children).enter().append("svg:path")
            // .attr('d', function(d) {
            //     var x = (d.x - v[0]) * k;
            //     var y = (d.y - v[1]) * k;
            //     var fX = (activeNode.x - v[0]) * k;
            //     var fY = (activeNode.y - activeNode.r - v[1]) * k;
            //     return 'M ' + fX + ' ' + -fY + ' Q ' + (parseInt(fX) + 20) + ' ' + y / 2 + ' ' + x + ' ' + y
            // })
            // .attr("style", function(d) {
            //     return "stroke:#4169E1;stroke-width:4;fill:none;";
            // })
            // .attr('marker-end', 'url(#head)');
        // }
    }
}