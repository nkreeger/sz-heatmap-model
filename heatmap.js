import * as d3 from 'd3';

const SIZE = 10;
const WIDTH = 500;
const HEIGHT = 500;

export class StrikeZoneHeatmap {
  constructor(coords) {
    const colorDomain = d3.extent(coords, (coord) => {
      return coord.value;
    });

    this.ballColorScale = d3.scaleLinear().domain(colorDomain).range([
      'rgba(0,0,255,0.1)', 'rgba(0,0,255,0.25)'
    ]);
    this.strikeColorScale = d3.scaleLinear().domain(colorDomain).range([
      'rgba(255,0,0,0.2)', 'rgba(255,0,0,0.75)'
    ]);

    this.svg = d3.select('.strike-zone')
                   .append('svg')
                   .attr('width', WIDTH)
                   .attr('height', HEIGHT);

    // scale:
    const min = coords[0];
    const max = coords[coords.length - 1];
    this.scaleX =
        d3.scaleLinear().domain([min.x, max.x]).range([0, WIDTH / SIZE]);
    this.scaleY =
        d3.scaleLinear().domain([min.y, max.y]).range([0, HEIGHT / SIZE]);

    const minx = this.scaleX(min.x) * SIZE;
    const maxx = this.scaleX(max.x) * SIZE;
    const miny = this.scaleY(min.y) * SIZE;
    const maxy = this.scaleY(max.y) * SIZE;

    this.rects = this.svg.selectAll('rect').data(coords).enter().append('rect');
    this.render();
  }

  update(coords) {
    this.rects.data(coords);
    // d3.transition?
    this.render();
  }

  render() {
    this.rects
        .attr(
            'x',
            (coord) => {
              return this.scaleX(coord.x) * SIZE;
            })
        .attr(
            'y',
            (coord) => {
              return this.scaleY(coord.y) * SIZE;
            })
        .attr('width', SIZE)
        .attr('height', SIZE)
        .style('fill', (coord) => {
          if (coord.strike) {
            return this.strikeColorScale(coord.value);
          } else {
            return this.ballColorScale(coord.value);
          }
        });
  }
}