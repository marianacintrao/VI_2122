var root,
    nodes,
    g,
    circleMargin = 10,
    scale = 30;

    const cirlcularPackingSize = height / 3 + (p * 1.8);

// select("pop", data)
function select(selected, data) {
    data["children"].forEach(d => {
        if (d["name"] == selected) {
            root = d;
        }
    });
}

function changeDataset(id, new_dataset, theme_name) {
    root = new_dataset;
    d3.select(id).selectAll("svg").remove();
    changeAreaEncoding("#circularPacking", theme_name, root);
}

function changeAreaEncoding(id, theme_name, data_root) {
    root = data_root;
    var pack = d3.pack()
        .size([cirlcularPackingSize -10, cirlcularPackingSize -10]);

    root = d3.hierarchy(root)        
        .sum(function (d) {
            switch (theme_name) {
                case "dating": return d.dating;
                case "violence": return d.violence;
                case "world/life": return d.life;
                case "night/time": return d.time;
                case "shake the audience": return d.audience;
                case "family/gospel": return d.family;
                case "romantic": return d.romantic;
                case "communication": return d.communication;
                case "movement/places": return d.places;
                case "music": return d.music;
                case "obscene": return d.obscene;
                case "light/visual perceptions": return d.visual;
                case "family/spiritual": return d.spiritual;
                case "like/girls": return d.girls;
                case "sadness": return d.sadness;
                case "feelings": return d.feelings;
                default: return d.theme_weight;
            }
        });
        
    var nodes = pack(root);

    // d3.select(id).selectAll("g.node").remove();

    g
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
            .attr("class", "node")
            .append("circle")
                .attr("fill", function (d) {
                    return color(d.data.children);
                })
                .attr("stroke", function (d) {
                    return color(d.data.children);
                })
                .attr("stroke-width", 2)
                .attr("fill-opacity", 0.3)
                .attr("text-align", "center")
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", function (d) {
                        return d.r * 0.9;
                })
                .on("click", function(d) {
                    console.log(d.theme_name);
                });

    g
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
            .attr("class", "label")
            .style("fill-opacity", function(d) {
                return d.parent === root ? 1 : 0;
            })
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .style("display", function(d) {
                return d.parent === root ? "inline" : "none";
            })
            .text(function(d) {
                return d.data.name;
            });
}

function circularPacking(id, data) {
    g = d3
        .select("#circularPacking")
        .append("svg")
        .attr("width", cirlcularPackingSize)
        .attr("height", cirlcularPackingSize)
        .append("g");
  
    changeAreaEncoding(id, "theme_weight", data);
}