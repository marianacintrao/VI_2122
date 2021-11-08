var data;

// select("pop", data)
function select(selected, data) {
    data["children"].forEach(d => {
        if (d["name"] == selected) {
            console.log(d);
            root = d;
        }
    });
}

function changeDataset(new_dataset) {
    data = new_dataset;

}

function CircularPacking(id, data_root) {
    data = data_root;
    console.log(data);
    var svg = d3.select(id).select("svg"),
        margin1 = 20,
        diameter = 400,
        g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
    
    var color1 = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    // var sizeScale = d3.scaleSqrt()
    //     .range([0,200])
    //     .domain([0, d=>d.theme_weight]);
    // pack.radius(d=>sizeScale(d.theme_weight));  
    
    
    var pack = d3.pack()
        .size([diameter - margin1, diameter - margin1])
        .radius(function(d) {
            // console.log(Object.values(d.parent));
            // console.log(d.parent.data.name);
            console.log(d.depth);
            // d.parent.attr("value", d.parent.value);
            return d.value;
        })
        .padding(2);
    
        
    // select("avg", data);
    root = data;
    root = d3.hierarchy(root)        
        .sum(function(d) {
            // console.log(d);
            return d.theme_weight*d.theme_weight*d.theme_weight*d.theme_weight*d.theme_weight*6;
        });
        // .sum(function (d) {
        //     switch (theme_name) {
        //         case "dating": return d.dating;
        //         case "violence": return d.violence;
        //         case "world/life": return d.life;
        //         case "night/time": return d.time;
        //         case "shake the audience": return d.audience;
        //         case "family/gospel": return d.family;
        //         case "romantic": return d.romantic;
        //         case "communication": return d.communication;
        //         case "movement/places": return d.places;
        //         case "music": return d.music;
        //         case "obscene": return d.obscene;
        //         case "light/visual perceptions": return d.visual;
        //         case "family/spiritual": return d.spiritual;
        //         case "like/girls": return d.girls;
        //         case "sadness": return d.sadness;
        //         case "feelings": return d.feelings;
        //         default: return d.theme_weight;
        //       }
        // });
        //.sort(function(a, b) {
        //    return b.value - a.value;
        //});



    var focus = root;
    var nodes = pack(root);
            //.descendants();
    var view;

    var circle = g.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function(d) {
            return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
        })
        .style("fill", function(d) {
            return d.children ? color1(d.depth) : null;
        })
        //.attr("r", function(d) { return d.parent ? 20 : d.data.theme_weight;})
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