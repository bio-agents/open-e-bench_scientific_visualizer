import * as JQuery from "jquery";
const $ = JQuery.default;

export function append_dots_errobars (svg, data, xScale, yScale, div, cValue, color,divid, metric_x, metric_y, metrics_names){

  // Add Y Axis Error Line
  svg.append("g").selectAll("line")
      .data(data).enter()
      .append("line")
      .attr("class", "error-line")
      .attr("stroke", "black")
      .style("stroke-dasharray", ("2, 2"))
      .attr("id", function (d) { return divid+"___line"+d.agentname.replace(/[\. ()/-]/g, "_");})
      .attr("x1", function(d) {
        return xScale(d.x);
      })
      .attr("y1", function(d) {
        return yScale(d.y + d.e_y);
      })
      .attr("x2", function(d) {
        return xScale(d.x);
      })
      .attr("y2", function(d) {
        return yScale(d.y - d.e_y);
      });

  // Add X Axis Error Line
  svg.append("g").selectAll("line")
      .data(data).enter()
      .append("line")
      .attr("class", "error-line")
      .attr("stroke", "black")
      .style("stroke-dasharray", ("2, 2"))
      .attr("id", function (d) { return divid+"___lineX"+d.agentname.replace(/[\. ()/-]/g, "_");})
      .attr("x1", function(d) {
        return xScale(d.x - d.e_x);
      })
      .attr("y1", function(d) {
        return yScale(d.y);
      })
      .attr("x2", function(d) {
        return xScale(d.x + d.e_x);
      })
      .attr("y2", function(d) {
        return yScale(d.y);
      });

  // Add Error Top Cap
  svg.append("g").selectAll("line")
      .data(data).enter()
      .append("line")
      .attr("id", function (d) { return divid+"___top"+d.agentname.replace(/[\. ()/-]/g, "_");})
      .attr("class", "error-cap")
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x1", function(d) {
        return xScale(d.x) - 4;
      })
      .attr("y1", function(d) {
        return yScale(d.y + d.e_y);
      })
      .attr("x2", function(d) {
        return xScale(d.x) + 4;
      })
      .attr("y2", function(d) {
        return yScale(d.y + d.e_y);
      });

  // Add Error Bottom Cap
  svg.append("g").selectAll("line")
      .data(data).enter()
      .append("line")
      .attr("id", function (d) { return divid+"___bottom"+d.agentname.replace(/[\. ()/-]/g, "_");})
      .attr("class", "error-cap")
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x1", function(d) {
        return xScale(d.x) - 4;
      })
      .attr("y1", function(d) {
        return yScale(d.y - d.e_y);
      })
      .attr("x2", function(d) {
        return xScale(d.x) + 4;
      })
      .attr("y2", function(d) {
        return yScale(d.y - d.e_y);
      });

  // add right error cap
  svg.append("g").selectAll("line")
      .data(data).enter()
      .append("line")
      .attr("class", "error-cap")
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .attr("id", function (d) { return divid+"___right"+d.agentname.replace(/[\. ()/-]/g, "_");})
      .attr("x1", function(d) {
        return xScale(d.x + d.e_x);
      })
      .attr("y1", function(d) {
        return yScale(d.y) - 4;
      })
      .attr("x2", function(d) {
        return xScale(d.x + d.e_x);
      })
      .attr("y2", function(d) {
        return yScale(d.y) + 4;
      });

    // add left error cap
    svg.append("g").selectAll("line")
      .data(data).enter()
      .append("line")
      .attr("class", "error-cap")
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .attr("id", function (d) { return divid+"___left"+d.agentname.replace(/[\. ()/-]/g, "_");})
      .attr("x1", function(d) {
        return xScale(d.x - d.e_x);
      })
      .attr("y1", function(d) {
        return yScale(d.y) - 4;
      })
      .attr("x2", function(d) {
        return xScale(d.x - d.e_x);
      })
      .attr("y2", function(d) {
        return yScale(d.y) + 4;
      });

  // add dots
  let formatComma = d3.format(",");
  let formatDecimal = d3.format(".4f");

  let dots =svg.selectAll(".dots")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "benchmark_path");
  
  // define the shapes of the dots
  let symbol = d3.symbol();

  var shapeScale = d3.scaleOrdinal()
            .domain(data.map(d => d.agentname))
            .range(Array(Math.ceil(data.length/7)).fill([d3.symbolCircle, d3.symbolCross, d3.symbolDiamond, d3.symbolSquare, d3.symbolStar, d3.symbolTriangle, d3.symbolWye]).flat());

    dots.attr("d", symbol.type(function(d){return shapeScale(d.agentname)}).size(Math.round($(window).height()* 0.2)))
      .attr("id", function (d) {  return divid+"___"+d.agentname.replace(/[\. ()/-]/g, "_");})
      .attr("class","line")
      .attr('transform',function(d){ return "translate("+xScale(d.x)+","+yScale(d.y)+")"; })
      .attr("r", 6)
      .style("fill", function(d) {
        return color(cValue(d));
      })
      .on("mouseover", function(d) {
        // show agenttip only if the agent is visible
        let ID = divid+"___"+d.agentname.replace(/[\. ()/-]/g, "_");
        if (metric_x.startsWith("OEBM") == true){
          var txt_x = metrics_names[metric_x];
        } else if ( metric_x in metrics_names) {
          var txt_x = metrics_names[metric_x];
        } else {
          var txt_x = metric_x;
        };
        if (metric_y.startsWith("OEBM") == true){
          var txt_y = metrics_names[metric_y];
        } else if ( metric_y in metrics_names) {
          var txt_y = metrics_names[metric_y];
        } else {
          var txt_y = metric_y;
        };
        if (d3.select("#"+ID).style("opacity") == 1) {
          div.transition()		
              .duration(100)		
              .style("display","block")		
              .style("opacity", .9);		
          div.html("<b>" + d.agentname + "</b><br/>"  + txt_x + ": " + formatComma(d.x) + "<br/>"  + txt_y + ": " + formatDecimal(d.y))	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY) + "px");
        }
      })					
      .on("mouseout", function(d) {		
        div.transition()		
          .duration(1500)
          .style("display","none")		
          .style("opacity", 0);	
      });
    
    
};
