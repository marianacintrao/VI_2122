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
    var packLayout = d3.pack().size([500, 500]);
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
        .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
        .attr("stroke", "#ADADAD")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.r;
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
        .style("font", "8px sans-serif")
        .style("display", (d) => (d.children ? "none" : "inline"))
        .text(function (d) {
            return genres_dict[d.data.data.child];
        });
}

function circularPacking() {
    color = d3
        .scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);
  
    g = d3
        .select("#circularPacking")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500)
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