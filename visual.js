import * as d3 from 'd3';

function testChart() {
  const data = [30, 86, 168, 281, 303, 365];
  const width = 420;
  const barHeight = 20;

  const x = d3.scaleLinear().domain([0, d3.max(data)]).range([0, width]);

  const chart = d3.select('.chart')
                    .attr('width', width)
                    .attr('height', barHeight * data.length);

  const bar = chart.selectAll('g').data(data).enter().append('g').attr(
      'transform', (d, i) => {
        return `translate(0,${i * barHeight})`;
      });

  bar.append('rect').attr('width', x).attr('height', barHeight - 1);

  bar.append('text')
      .attr('x', (d) => {return x(d) - 3})
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text((d) => {
        return d;
      });
}

testChart();