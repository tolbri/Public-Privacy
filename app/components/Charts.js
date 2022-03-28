import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);
Chart.defaults.datasets.pie.backgroundColor = [
  '#F4442D',
  '#010121',
  '#E2DBCC',
  '#282828',
];
Chart.defaults.datasets.pie.hoverBackgroundColor = [
  '#F4442D',
  '#010121',
  '#E2DBCC',
  '#282828',
];
Chart.defaults.datasets.pie.borderColor = '#F6EEDC';
Chart.defaults.datasets.pie.hoverBorderColor = '#F6EEDC';
Chart.defaults.elements.bar.backgroundColor = '#F4442D';
Chart.defaults.set('plugins.datalabels', {
  color: '#010121',
  align: 'end',
  anchor: 'end',
  display: 'auto',
  formatter: (value, ctx) => {
    const datasets = ctx.chart.data.datasets;
    if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
      const sum = datasets[0].data.reduce((a, b) => a + b, 0);
      const percentage = Math.round((value / sum) * 100) + '%';
      return ctx.chart.data.labels[ctx.dataIndex] + ': ' + percentage;
    }
  },
});
Chart.defaults.plugins.tooltip.backgroundColor = '#010121';
Chart.defaults.plugins.tooltip.borderColor = '#F6EEDC';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 0;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.aspectRatio = 2;
// Chart.defaults.events = '';
Chart.defaults.plugins.legend.display = false;
Chart.defaults.layout.padding = { top: 0, right: 100, bottom: 0, left: 100 };
Chart.defaults.animation.duration = 1000;
Chart.defaults.animation.easing = 'easeInOutExpo';

export default class Charts {
  constructor() {
    this.drawCharts();
  }

  drawCountryChart() {
    const countryChartElement = document.getElementById('country__chart');
    const countryCanvas = countryChartElement.getContext('2d');
    const countryData = JSON.parse(
      countryChartElement.getAttribute('chart-data')
    );
    const countryOptions = {
      type: 'pie',
      data: countryData,
      options: {
        plugins: {
          datalabels: {},
        },
      },
    };

    this.countryChart = new Chart(countryCanvas, countryOptions);
  }

  drawDeviceChart() {
    const countryChartElement = document.getElementById('device__chart');
    const countryCanvas = countryChartElement.getContext('2d');
    const countryData = JSON.parse(
      countryChartElement.getAttribute('chart-data')
    );
    const countryOptions = {
      type: 'pie',
      data: countryData,
      options: {
        animation: {
          delay: 200,
        },
        plugins: {
          datalabels: {},
        },
      },
    };

    this.deviceChart = new Chart(countryCanvas, countryOptions);
  }

  drawCharts() {
    this.drawCountryChart();
    this.drawDeviceChart();
  }

  destroyCharts() {
    this.countryChart.destroy();
    this.deviceChart.destroy();
  }

  destroy() {
    this.destroyCharts();
  }
}
