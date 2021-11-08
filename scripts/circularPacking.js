function CircularPacking(id, data) {
    var svg = d3.select(id).select("svg"),
        margin1 = 20,
        diameter = 400,
        g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
    
    var color1 = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([diameter - margin1, diameter - margin1])
        .radius(function(d) {
            console.log("radius d:", d);
            return d.theme_weight;
            return 10;
        })
        .padding(2);
        
        root = data;
        root = d3.hierarchy(root)
            .sum(function(d) {
                console.log("sum:", d.name, d.theme_weight);
                return d.theme_weight;
            })
            // .sum(function(d) {
            //     console.log("sum:", d.name, d.theme_weight);
            //     return d.theme_weight;
            // })
            .sort(function(a, b) {
                return b.theme_weight - a.theme_weight;
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

    // console.log(root.x, root.y, root.r);
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