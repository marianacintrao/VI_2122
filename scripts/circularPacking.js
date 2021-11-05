var data_path = "datasets/main_genre_by_parent.csv",
    nestedData,
    nodes,
    g;

function setup() {
    d3
        .csv(data_path)
        .then(function (ams) {
            data = ams;
            processData();
            circularPacking();
        })
        .catch((error) => {
            console.log(error);
        });
}
  
const cirlcularPackingSize = height / 3 + (p * 1.8);

function processData() {
    var stratify = d3
        .stratify()
        .parentId(function (d) {
        return d.parent;
        })
        .id(function (d) {
        return d.child;
        });
    nestedData = stratify(data);
}

function changeAreaEncoding(theme_name) {
    var packLayout = d3.pack().size([cirlcularPackingSize -10, cirlcularPackingSize -10]);
    var root = d3.hierarchy(nestedData).sum(function (d) {
        switch (theme_name) {
            case "dating": return d.data.dating;
            case "violence": return d.data.violence;
            case "world/life": return d.data.life;
            case "night/time": return d.data.time;
            case "shake the audience": return d.data.audience;
            case "family/gospel": return d.data.family;
            case "romantic": return d.data.romantic;
            case "communication": return d.data.communication;
            case "movement/places": return d.data.places;
            case "music": return d.data.music;
            case "obscene": return d.data.obscene;
            case "light/visual perceptions": return d.data.visual;
            case "family/spiritual": return d.data.spiritual;
            case "like/girls": return d.data.girls;
            case "sadness": return d.data.sadness;
            case "feelings": return d.data.feelings;
            default: return d.data.theme_weight;
          }
    });
    nodes = root.descendants();
    packLayout(root);

    d3.select("#circularPacking").selectAll("g.node").remove();

    g
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
            .attr("class", "node")
            .append("circle")
                // .attr("fill", (d) => (d.children ? "none" : "white"))
                .attr("fill", function (d) {
                    return color(d.data.data.child);
                })
                .attr("stroke", function (d) {
                    return color(d.data.data.child);
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
                    // if (d.data.data.child == "genre")
                    //     return d.r * 1
                    // else
                        return d.r * 0.9;
                })
                .append("title")
                .text(function (d) {
                    return d.data.data.child;
                });
  
    g
        .selectAll(".node")
        .append("text")
            .attr("class", "label")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .attr("dx", "-25")
            .attr("dy", ".5em")
            .style("font", "11px sans-serif")
            .style("fill", _white)
            .style("display", (d) => (d.children ? "none" : "inline"))
            .text(function (d) {
                return genres_dict[d.data.data.child];
            });
}

function circularPacking() {
    // color = d3
    //     .scaleOrdinal()
    //     .domain(["genre", "rock", "pop", "jazz",    "country", "rnb",   "hiphop", "reggae", "folk", "metal", "blues", "punk",   "electronica", "religious"])
    //     .range([ _grey,   _red,   _pink, _lavender, _orange,   _purple, _lime,    _olive,   _green, _yellow, _blue,   _magenta, _teal,         _cyan])
         
  
    g = d3
        .select("#circularPacking")
        .append("svg")
        .attr("width", cirlcularPackingSize)
        .attr("height", cirlcularPackingSize)
        .append("g");
  
    changeAreaEncoding("theme_weight");
}

function clipText(d, t) {
    var text = t.substring(0, d.r / 2);
    if (text.length < t.length) {
      text = text.substring(0, text.length - Math.min(2, text.length)) + "...";
    }
    return text;
}