// set the dimensions and margins of the graph
var margin = {top: 50, right: 150, bottom: 50, left: 60},
    width = 450 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function responsivefy(svg) {
      // get container + svg aspect ratio
      var container = d3.select(svg.node().parentNode),
          width = parseInt(svg.style("width")),
          height = parseInt(svg.style("height")),
          aspect = width / height;

      // add viewBox and preserveAspectRatio properties,
      // and call resize so that svg resizes on inital page load
      svg.attr("viewBox", "0 0 " + width + " " + height)
          .attr("preserveAspectRatio", "xMinYMid")
          .call(resize);

      // to register multiple listeners for same event type,
      // you need to add namespace, i.e., 'click.foo'
      // necessary if you call invoke this function for multiple svgs
      // api docs: https://github.com/mbostock/d3/wiki/Selections#on
      d3.select(window).on("resize." + container.attr("id"), resize);

      // get width of container and resize svg to fit it
      function resize() {
          var targetWidth = parseInt(container.style("width"));
          svg.attr("width", targetWidth);
          svg.attr("height", Math.round(targetWidth / aspect));
      }
    }

// append the svg object to the body of the page
var cycle_svg = d3.select("#my_cycleviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


//Read the data
d3.csv("cleaned_data.csv").then(function(data) {

    var d_2019 = data.filter(function(d){
            return d.year == ('2019');
    })
    var cycle_2019 = d_2019.filter(function(d){
            return d.type == ('Ride');
    })

    var d_2020 = data.filter(function(d){
            return d.year == ('2020');
    })
    var cycle_2020 = d_2020.filter(function(d){
            return d.type == ('Ride');
    })

    // Add X axis
    var x = d3.scaleLinear()
        .domain([1, 12])
        .range([ 0, width]);
    cycle_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues([]))
        .attr("class", "axis");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0,7000])
        .range([ height, 0])
    cycle_svg.append("g")
        .call(d3.axisLeft(y).tickValues([]))
        .attr("class", "axis");

    // Add the 2020 line
    const cycle_line = cycle_svg.append("path")
      .datum(cycle_2020)
      .attr("fill", "none")
      .attr("stroke", "#CEA1C3")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function(d) { return x(d['month']) })
        .y(function(d) { return y(d['cumulative_dist']) })
        )

    const pathLength = cycle_line.node().getTotalLength();
    const transitionPath = d3
      .transition()
      .ease(d3.easeSin)
      .duration(5000);

    cycle_line
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    // Add the 2019 line
    cycle_svg.append("path")
      .datum(cycle_2019)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function(d) { return x(d['month']) })
        .y(function(d) { return y(d['cumulative_dist']) })
        )

    // add 2020 label
    var last_2020 = cycle_2020.length - 1
    cycle_svg.append("text")
    .transition()
    .delay(5000)
    .duration(0)
      .attr("font-family", "sans-serif")
      .attr("font-size", 30)
    .attr("alignment-baseline", "middle")
    .style('fill', '#CEA1C3')
    .attr("x", x(12) + 15)
    .attr("y", y(cycle_2020[last_2020]['cumulative_dist']))
      .text(Math.round(cycle_2020[last_2020]['cumulative_dist']) + "km")

    // add 2019 label
    var last_2019 = cycle_2019.length - 1;
    cycle_svg.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 30)
    .attr("alignment-baseline", "middle")
    .style('fill', 'grey')
    .attr("x", x(12) + 15)
    .attr("y", y(cycle_2019[last_2019]['cumulative_dist']))
      .text(Math.round(cycle_2019[last_2019]['cumulative_dist']) + "km");

})
