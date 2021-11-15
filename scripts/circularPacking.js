var root,
    nodes,
    g,
    circleMargin = 10,
    scale = 30;

const cirlcularPackingSize = height / 3 + (p * 1.8);

const displayTooltip = function(event, d) {
    var selected_name = d.data.name;
    var selected_genre;
    if (data_index == 0) {
        selected_genre = selected_name;
    }
    else if (data_index == 1) {
        selected_genre = currentLevel;
    }
    else {
        selected_genre = previousLevel;
    }

    d3
        .select("#tooltip-circularPacking")
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .style("opacity", 1)
        .style("background-color", color(selected_genre))
        .select("#value")
        .text(selected_name);

    highlightLine(selected_name, color(selected_genre), d);
    getRadarArea(selected_name, "circular");
    highlightCircle(selected_name);
}

const hideTooltip = function(event, d) {
    d3
        .select("#tooltip-circularPacking")
        .style("opacity", 0);

    var selected = d.data.name;
    unhighlightLine(selected);
    unhighlightCircle(selected)

    d3.selectAll("#path-hovered_" + "circular").remove();
    d3.selectAll("#g-hovered_" + "circular").remove();
}

function highlightCircle(name) {
    d3
        .selectAll("#circle-" + name.replace(/ /g, "").replace("'", "").replace("&", "n"))
        .attr("fill-opacity", 1);
}

function unhighlightCircle(name) {
    d3
        .selectAll("#circle-" + name.replace(/ /g, "").replace("'", "").replace("&", "n"))
        .attr("fill-opacity", 0.3);
}

function select(selected) {
    root["children"].forEach(d => {
        if (d["name"] == selected && data_index == 1) {
            root = d;
            return;
        }
        else if (d["name"] == previousLevel && data_index == 2) {
            root = d;
            root["children"].forEach(d => {
                if (d["name"] == selected) {
                    root = d;
                    return;
                }
            })
        }
    });
}

function changeAreaEncoding(id) {
    root = data_circular_packing[data_index];
    if (currentLevel === undefined)
        select("avg");
    else
        select(currentLevel); 
    
    var pack = d3.pack()
        .size([cirlcularPackingSize -10, cirlcularPackingSize -10]);

    root = d3.hierarchy(root)        
        .sum(function (d) {
            switch (currentTheme) {
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
    d3.select(id).selectAll("g.node").remove();

    g
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
            .attr("class", "node")
            .append("circle")
                .attr("id", function(d) { return "circle-" + d.data.name.replace(/ /g, "").replace("'", "").replace("&", "n");})
                .attr("fill", function (d) {
                    if (data_index == 0) {
                        return color(d.data.name)
                    }
                    else if (data_index == 1) {
                        return color(currentLevel);
                    }
                    else {
                        return color(previousLevel);
                    }
                    // return color(d.data.name);
                })
                .attr("stroke", function (d) {
                    if (data_index == 0) {
                        return color(d.data.name)
                    }
                    else if (data_index == 1) {
                        return color(currentLevel);
                    }
                    else {
                        return color(previousLevel);
                    }
                    // return color(d.data.name);
                })
                .attr("stroke-width", 2)
                .attr("fill-opacity", 0.3)
                .attr("text-align", "center")
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("r", function (d) {
                    if (d == root)
                        return 0;
                    return d.r * 0.9;
                })
                .attr("style", function(d) {
                    if (d.depth == 1) return;
                    return "visibility: hidden"
                })
                .attr("name", function (d) {
                    return d.data.name;
                })
                .on("click", function(d) {
                    if (data_index < 2) {
                        data_index = data_index + 1;
                        previousLevel = currentLevel;
                        currentLevel = this.getAttribute("name");
                        changeAreaEncoding("#circularPacking");
                        if (data_index == 1) changeToSubgenreLevel(currentLevel);
                        else if (data_index == 2) changeToArtistLevel(currentLevel);
                    }
                })
                .on("mouseover", displayTooltip)
                .on("mouseleave", hideTooltip)

    
    updateLabel();
}

function circularPacking(id) {
    g = d3
        .select(id)
        .append("svg")
        .attr("width", cirlcularPackingSize)
        .attr("height", cirlcularPackingSize)
        .append("g");

    changeAreaEncoding(id);
}