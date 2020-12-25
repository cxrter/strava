// set the dimensions and margins of the graph
var margin = {top: 50, right: 100, bottom: 50, left: 100},
    this_width = 1800 - margin.left - margin.right,
    this_height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var year_svg = d3.select("#my_yearviz")
  .append("svg")
    .attr("width", this_width + margin.left + margin.right)
    .attr("height", this_height + margin.top + margin.bottom)
    .call(responsivefy)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("cleaned_data.csv", d3.autoType).then(function(data) {


var year_2019 = data.filter(function(d){
        return d.year == ('2019');
})

var year_2020 = data.filter(function(d){
        return d.year == ('2020');
})

var year_2020 = d3.rollups(year_2020, v => d3.sum(v, d => d.moving_time), d => d.month)
var year_2019 = d3.rollups(year_2019, v => d3.sum(v, d => d.moving_time), d => d.month)

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Add X axis
    var x = d3.scaleLinear()
        .domain([1, 12])
        .range([0, this_width]);
    year_svg.append("g")
        .attr("transform", "translate(0," + this_height + ")")
        .call(d3.axisBottom(x).tickFormat(function(d, i){return month[i];}))
        .attr("class", "year_axis")

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0 , 60])
        .range([ this_height, 0])
    year_svg.append("g")
        .call(d3.axisLeft(y).tickValues([20,40,60]))
        .attr("class", "year_axis");

    // Add the 2020 line
    const path_2020 = year_svg.append("path")
      .datum(year_2020)
      .attr("fill", "none")
      .attr("stroke", "#B88B4A")
      .attr("stroke-width", 8)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )

    const pathLength = path_2020.node().getTotalLength();
    const transitionPath = d3
      .transition()
      .ease(d3.easeSin)
      .duration(5500);

    path_2020
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    // Add the 2019 line
    year_svg.append("path")
      .datum(year_2019)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 6)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )

var total_2020 = d3.rollups(data, v => d3.sum(v, d => d.distance), d => d.year)
var total_times = d3.rollups(data, v => d3.sum(v, d => d.moving_time), d => d.year)
console.log(total_times)

last = total_times.length - 1
second_last = total_times.length - 2
document.getElementById("2019_hours").innerHTML = Math.round(total_times[second_last][1]);
document.getElementById("2020_hours").innerHTML = Math.round(total_times[last][1]);
})
