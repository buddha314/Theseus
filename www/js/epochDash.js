function intializeEpochDash(payload) {
  console.log("intialize!");
  var svg = d3.select("#newchart");
  var margin = {top: 20, right: 20, bottom: 30, left: 50};
  console.log("margin");

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%d-%b-%y");

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the line
  var valueline = d3.line()
      .x(function(d) { return x(d.epoch); })
      .y(function(d) { return y(d.steps); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


  var data = [
    {epoch: 1.0, steps: 50},
    {epoch: 2.0, steps: 40},
    {epoch: 3.0, steps: 35},
    {epoch: 4.0, steps: 25}
  ]

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.epoch; }));
    y.domain([0, d3.max(data, function(d) { return d.steps; })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

  //});



}

function epochDash(topic, payload) {

  if (topic == "/epoch/update") {
    var j = JSON.parse(new TextDecoder("utf-8").decode(payload));
    var msg = "<br> Epoch: " + j.id + " steps: " + j.steps + " winner: " + j.winner;
    document.getElementById('epoch-report').innerHTML += msg;
    console.log("Now I want to add data to ");
  } else if (topic == "/epoch/setup") {
    var j = JSON.parse(new TextDecoder("utf-8").decode(payload));
    console.log("setting up epoch dash with max steps " + j.maxsteps);
    //intializeEpochDash(payload);
  }

}
