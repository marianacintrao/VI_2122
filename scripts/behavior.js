function init() {
  var dataset = [];
  var data_file = "/datasets/themes_by_genre.csv";
  //var variable_to_use = "rating";
  d3.csv(data_file)
    .then((data) => {
      //data.forEach(function (x) {
      //  //dataset[dataset.length] = x[variable_to_use];
      //});
      createLineChart(dataset);
      //createBoxPlot(dataset);
    })
    .catch((error) => {
      console.log(error);
    });
}

function createLineChart(data) {

}


