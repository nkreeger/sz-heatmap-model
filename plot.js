
export function draw(divId, px, pz) {
  var trace1 = {
    x: px,
    y: pz,
    mode: 'markers',
    name: 'points',
    marker: {color: 'rgb(102,0,0)', size: 2, opacity: 0.4},
    type: 'scatter'
  };
  var trace2 = {
    x: px,
    y: pz,
    name: 'density',
    ncontours: 20,
    colorscale: 'Hot',
    reversescale: true,
    showscale: false,
    type: 'histogram2dcontour'
  };
  var trace3 = {
    x: px,
    name: 'x density',
    marker: {color: 'rgb(102,0,0)'},
    yaxis: 'y2',
    type: 'histogram'
  };
  var trace4 = {
    y: pz,
    name: 'y density',
    marker: {color: 'rgb(102,0,0)'},
    xaxis: 'x2',
    type: 'histogram'
  };
  var data = [trace1, trace2, trace3, trace4];
  var layout = {
    showlegend: false,
    autosize: false,
    width: 600,
    height: 550,
    margin: {t: 50},
    hovermode: 'closest',
    bargap: 0,
    xaxis: {domain: [0, 0.85], showgrid: false, zeroline: false},
    yaxis: {domain: [0, 0.85], showgrid: false, zeroline: false},
    xaxis2: {domain: [0.85, 1], showgrid: false, zeroline: false},
    yaxis2: {domain: [0.85, 1], showgrid: false, zeroline: false}
  };
  Plotly.newPlot(divId, data, layout);
}