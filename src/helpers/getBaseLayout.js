export default () => ({
  title: {
    text: '<b>Nuovi casi vs Totale casi (scala logaritmica)</b>',
  },
  xaxis: {
    type: 'log',
    // autorange: true,
    title: 'Totale casi',
    range: [0, Math.log10(100000)],
    showline: true,
  },
  yaxis: {
    type: 'log',
    // autorange: true,
    title: 'Nuovi casi nella settimana precedente',
    range: [0, Math.log10(100000)],
    showline: true,
    linecolor: 'rgb(224,224,224)',
  },
  responsive: true,
  autosize: true,
  showlegend: false,
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
});
