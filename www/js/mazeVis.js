function buildMaze(div, width, height, payload) {
  var radius = 10;
  var nRows = 10;
  var nCols = 10;
  var interCircleDistance = 32;
  var hallBuffer = radius + 2;
  var j = JSON.parse(new TextDecoder("utf-8").decode(payload));

  var svg = d3.select("#maze").append("svg:svg");
  svg.attr("width", width).attr("height", height);

  var xyFromId = function(d) {
    //console.log("xyFromId");
    //console.log(d);
    var p = {x:interCircleDistance / 2 + ((d-1) % nRows) * interCircleDistance
      ,y:interCircleDistance / 2 + parseInt((d-1) / nCols) * interCircleDistance};
    return p;
  }

  var hall = function(d) {
    console.log(d);
    var x1, x2, y1, y2;
    var x1 = xyFromId(d.source).x;
    var y1 = xyFromId(d.source).y;
    var x2 = xyFromId(d.target).x;
    var y2 = xyFromId(d.target).y;
    if (y1 == y2) {
      console.log("adjusting");
      console.log(d);
      x1 = x1 + hallBuffer;
      x2 = x2 - hallBuffer;
    }
    if (x1 == x2) {
      y1 += hallBuffer;
      y2 -= hallBuffer;
    }
    var l = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    }
    console.log(l);
    return l;
  }

  var line = d3.line()
    .x(function(d) {return xyFromId(d.source)})
    .y(function(d) {return xyFromId(d.target)})


  var node = svg.append("g")
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(j.nodes)
    .enter().append('circle')
    .attr('r', radius)
    //.attr('cx', function (d) {return interCircleDistance / 2 + ((d.id-1) % nRows) * interCircleDistance})
    .attr('cx', function (d) {return xyFromId(d.id).x})
    .attr('cy', function (d) {return xyFromId(d.id).y})
    .attr("class", function(d) {return "v"+d.id;})
    .classed('node', true)
    .classed('active', false);


  console.log("j.links");
  var links = [];
  // Just take the super-diagonal
  for (var i=0; i < j.links.length; i++) {
    if (j.links[i].source < j.links[i].target) {
      //console.log("pushing");
      links.push(j.links[i]);
    }
  }
  console.log(links);

  var link = svg.append("g")
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter().append("line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("x1", function(d) {return hall(d).x1;})
    .attr("y1", function(d) {return hall(d).y1;})
    //.attr("x1", function(d) {return xyFromId(d.source).x;})
    //.attr("y1", function(d) {return xyFromId(d.source).y;})
    .attr("x2", function(d) {return hall(d).x2;})
    .attr("y2", function(d) {return hall(d).y2;})
    //.attr("x2", function(d) {return xyFromId(d.target).x;})
    //.attr("y2", function(d) {return xyFromId(d.target).y;})
}
