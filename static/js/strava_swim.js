// set the dimensions and margins of the graph
var margin = {top: 50, right: 150, bottom: 50, left: 60},
    width = 450 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var swim_svg = d3.select("#my_swimviz")
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
    var swim_2019 = d_2019.filter(function(d){
            return d.type == ('Swim');
    })

    var d_2020 = data.filter(function(d){
            return d.year == ('2020');
    })
    var swim_2020 = d_2020.filter(function(d){
            return d.type == ('Swim');
    })

    month = ['Jan', 'Dec']

    // Add X axis
    var x = d3.scaleLinear()
        .domain([1, 12])
        .range([ 0, width ]);
    swim_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues([1,12]).tickFormat(function(d, i){return month[i];}))
        .attr("class", "type_axis");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0,100])
        .range([ height, 0])
    swim_svg.append("g")
        .call(d3.axisLeft(y).tickValues([]))
        .attr("class", "axis");


    // Add the 2020 line
    const swim_line = swim_svg.append("path")
      .datum(swim_2020)
      .attr("fill", "none")
      .attr("stroke", "#7899D4")
      .attr("stroke-width", 8)
      .attr("d", d3.line()
        .x(function(d) { return x(d['month']) })
        .y(function(d) { return y(d['cumulative_dist']) })
        )

    const pathLength = swim_line.node().getTotalLength();
    const transitionPath = d3
      .transition()
      .ease(d3.easeSin)
      .duration(5000);

    swim_line
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    // Add the 2019 line
    swim_svg.append("path")
      .datum(swim_2019)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 6)
      .attr("d", d3.line()
        .x(function(d) { return x(d['month']) })
        .y(function(d) { return y(d['cumulative_dist']) })
        )

    var last_2020 = swim_2020.length - 1;
    // add 2020 label
    swim_svg.append("text")
    .transition()
    .delay(5000)
    .duration(0)
      .attr("font-family", "sans-serif")
      .attr("font-size", 30)
    .attr("alignment-baseline", "middle")
    .style('fill', '#7899D4')
    .attr("x", x(12) + 15)
    .attr("y", y(swim_2020[last_2020]['cumulative_dist']))
      .text(Math.round(swim_2020[last_2020]['cumulative_dist']) + "km");

    // add 2019 label
    var last_2019 = swim_2019.length - 1;
    swim_svg.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 30)
    .attr("alignment-baseline", "middle")
    .style('fill', 'grey')
    .attr("x", x(12) + 15)
    .attr("y", y(swim_2019[last_2019]['cumulative_dist']))
      .text(Math.round(swim_2019[last_2019]['cumulative_dist']) + "km");

})
