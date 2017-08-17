import Ember from 'ember';
import Plotly from 'plotly';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),

  stock: null,

  loading: false,

  fetchError: null,

  noData: false,

  chart: {
    chartElementId: 'chart-div',
    chartLayout: {
      dragmode: 'zoom',
      margin: {
        r: 50,
        t: 0,
        b: 0,
        l: 50
      },
      showlegend: false,
      xaxis: {
        autorange: true,
        domain: [0, 1],
        type: 'date'
      },
      yaxis: {
        autorange: true,
        domain: [0, 1],
        type: 'linear'
      }
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.send('fetchStockHistory')
  },

  actions: {
    fetchStockHistory() {
      if (!this.get('stock.symbol')) {
        return
      }

      this.set('fetchError', null)
      this.set('noData', false)
      this.set('loading', true)
      let symbol = encodeURIComponent(this.get('stock.symbol'))
      this.get('ajax').request(`/stocks/historical?symbol=${symbol}`,)
        .then(response => {
          const data = response.datatable.data
            .map(arr => {
              return {
                date: arr[6],
                open: arr[7],
                high: arr[8],
                low: arr[9],
                close: arr[10]
              }
            })
            .filter(obj => Object.keys(obj).every(key => obj[key] != null))
          this.send('sortByDate', data)

          if (!data.length) {
            this.set('noData', true)
          } else {
            this.send('renderPlot', data)
          }
        })
        .catch(error => {
          const {
            message: errorMessage = 'An unknown error occurred',
            payload: {
              message: errorDetails = ''
            } = {}
          } = error || {}
          this.set('fetchError', `${errorMessage}` + (errorDetails ? `: ${errorDetails}` : ''))
        })
        .then(() => this.set('loading', false))
    },

    sortByDate(data, desc) {
      let direction = desc ? -1 : 1
      data.sort(function (a, b) {
        if (a.date < b.date)
          return -1 * direction
        if (a.date > b.date)
          return 1 * direction
        return 0
      })
    },

    renderPlot(chartData = []) {
      let trace = {
        x: chartData.map(data => data.date),
        close: chartData.map(data => data.close),
        decreasing: { line: { color: 'red' } },
        high: chartData.map(data => data.high),
        increasing: { line: { color: 'green' } },
        low: chartData.map(data => data.low),
        open: chartData.map(data => data.open),
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y'
      }

      let data = [trace]
      let layout = this.get('chart.chartLayout')
      let elementId = this.get('chart.chartElementId')

      Plotly.plot(elementId, data, layout, { displayModeBar: false });
    }
  }
});
