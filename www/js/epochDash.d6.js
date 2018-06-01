function intializeEpochDash() {
  var svg = d3.select("#new-chart"),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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
    var x = d3.scaleLinear().range([0, j.epochs]);
    var y = d3.scaleLinear().range([0, j.maxsteps]);
    var g = d3.select("#new-chart").select("svg").select("g");
    g.call(d3.axisBottom(x));

  }

}
