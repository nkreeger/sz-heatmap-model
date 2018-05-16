
export function draw(divId, px, pz) {
  var trace1 = {
    x: px,
    y: pz,
    mode: 'markers',
    name: 'points',
    marker: {color: 'rgb(0,0,200)', size: 2, opacity: 0.75},
    type: 'scatter'
  };
  var trace2 = {
    x: px,
    y: pz,
    name: 'probability',
    ncontours: 20,
    colorscale: 'Reds',
    reversescale: false,
    showscale: false,
    type: 'histogram2dcontour'
  };
  var data = [trace1, trace2];
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

export function draw2(divId, balls, strikes) {
  const traceBalls = {
    x: balls.x,
    y: balls.y,
    mode: 'markers',
    name: 'points',
    marker: {color: 'rgb(0,0,200)', size: 3, opacity: 0.75},
    type: 'scatter'
  };
  const traceStrikes = {
    x: strikes.x,
    y: strikes.y,
    mode: 'markers',
    name: 'points',
    marker: {color: 'rgb(200,0,0)', size: 5, opacity: 0.75},
    type: 'scatter'
  };
  const ballsDensity = {
    x: balls.x,
    y: balls.y,
    name: 'density',
    ncontours: 20,
    colorscale: 'Blues',
    reversescale: true,
    showscale: false,
    type: 'histogram2dcontour'
  };
  const strikesDensity = {
    x: strikes.x,
    y: strikes.y,
    name: 'density',
    ncontours: 20,
    colorscale: 'Hot',
    reversescale: true,
    showscale: false,
    type: 'histogram2dcontour'
  };

  const data = [traceBalls, traceStrikes, ballsDensity];
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