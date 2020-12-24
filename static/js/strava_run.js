// set the dimensions and margins of the graph
var margin = {top: 50, right: 150, bottom: 50, left: 60},
    width = 450 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var run_svg = d3.select("#my_runviz")
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
    var run_2019 = d_2019.filter(function(d){
            return d.type == ('Run');
    })

    var d_2020 = data.filter(function(d){
            return d.year == ('2020');
    })
    var run_2020 = d_2020.filter(function(d){
            return d.type == ('Run');
    })

    // Add X axis
    var x = d3.scaleLinear()
        .domain([1, 12])
        .range([ 0, width ]);
    run_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues([]))
        .attr("class", "axis");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0,800])
        .range([ height, 0])
    run_svg.append("g")
        .call(d3.axisLeft(y).tickValues([]))
        .attr("class", "axis");

    // Add the 2020 line
    const run_line = run_svg.append("path")
      .datum(run_2020)
      .attr("fill", "none")
      .attr("stroke", "#F7A078")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function(d) { return x(d['month']) })
        .y(function(d) { return y(d['cumulative_dist']) })
        )

    const pathLength = run_line.node().getTotalLength();
    const transitionPath = d3
      .transition()
      .ease(d3.easeSin)
      .duration(5000);

    run_line
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    // Add the 2019 line
    run_svg.append("path")
      .datum(run_2019)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function(d) { return x(d['month']) })
        .y(function(d) { return y(d['cumulative_dist']) })
        )

    // add 2020 label
    var last_2020 = run_2020.length - 1;
    run_svg.append("text")
    .transition()
    .delay(5000)
    .duration(0)
      .attr("font-family", "sans-serif")
      .attr("font-size", 30)
    .attr("alignment-baseline", "middle")
    .style('fill', '#F7A078')
    .attr("x", x(12) + 15)
    .attr("y", y(run_2020[last_2020]['cumulative_dist']))
      .text(Math.round(run_2020[last_2020]['cumulative_dist']) + "km");

    // add 2019 label
    var last_2019 = run_2019.length - 1;
    run_svg.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 30)
    .attr("alignment-baseline", "middle")
    .style('fill', 'grey')
    .attr("x", x(12) + 15)
    .attr("y", y(run_2019[last_2019]['cumulative_dist']))
      .text(Math.round(run_2019[last_2019]['cumulative_dist']) + "km");


})
