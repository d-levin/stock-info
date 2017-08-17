import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  selectedStock: null,

  fetchError: false,

  loading: false,

  noData: false,

  query: null,

  stocks: [],

  tableHeaders: [
    {
      label: 'Symbol',
      key: 'symbol',
      style: Ember.String.htmlSafe('width: 200px')
    },
    {
      label: 'Name',
      key: 'name'
    }
  ],

  tableHeadersLength: Ember.computed('tableHeaders', function() {
    return this.get('tableHeaders').length
  }),

  modal: false,

  paginationMetaData: null,

  pageNumber: 1,
  pageSize: 15,
  sortColumn: 'name',
  sortDirection: 1,

  sort: Ember.computed('sortColumn', 'sortDirection', function() {
    return this.get('sortColumn') + (this.get('sortDirection') === 1 ? ',asc' : ',desc')
  }),

  hasMeta: Ember.computed('paginationMetaData', function() {
    return this.get('paginationMetaData') != null &&
      Object.keys(this.get('paginationMetaData')).length
  }),

  paginationObserver: Ember.observer(
    'pageNumber', 'sortColumn', 'pageSize', 'sortDirection', function() {
      this.send('fetchStocks')
    }
  ),

  cannotGoToPreviousPage: Ember.computed('paginationMetaData', function() {
    return this.get('paginationMetaData.totalPages') === 0 ||
      this.get('paginationMetaData.firstPage')
  }),

  cannotGoToNextPage: Ember.computed('paginationMetaData', function() {
    return this.get('paginationMetaData.lastPage')
  }),

  debouncer: null,

  queryObserver: Ember.observer('query', function() {
    if (this.get('debouncer') !== null) {
      return
    }
    let debouncer = Ember.run.debounce(this, function() {
      this.set('pageNumber', 1)
      this.send('fetchStocks')
      this.set('debouncer', null)
    }, 500)
    this.set('debouncer', debouncer)
  }),

  init() {
    this._super(...arguments)
    this.send('fetchStocks')
  },

  actions: {
    clearQuery() {
      this.set('query', null)
    },

    sort(key) {
      this.set('sortDirection', this.get('sortDirection') * -1)
      this.set('sortColumn', key)
    },

    nextPage() {
      if (this.get('paginationMetaData.lastPage')) {
        return
      }
      this.set('pageNumber', this.get('pageNumber') + 1)
    },

    lastPage() {
      if (this.get('paginationMetaData.lastPage')) {
        return
      }
      this.set('pageNumber', this.get('paginationMetaData.totalPages'))
    },

    previousPage() {
      if (this.get('paginationMetaData.firstPage')) {
        return
      }
      this.set('pageNumber', this.get('pageNumber') - 1)
    },

    firstPage() {
      if (this.get('paginationMetaData.firstPage')) {
        return
      }
      this.set('pageNumber', 1)
    },

    selectStockAndOpenModal(stock) {
      this.set('selectedStock', stock)
      this.set('modal', true)
    },

    clearSelectedStockAndCloseModal() {
      this.set('selectedStock', null)
      this.set('modal', false)
    },

    getSortDirection() {
      return this.get('sortDirection') === 1 ? ',asc' : ',desc'
    },

    fetchStocks() {
      this.set('fetchError', false)
      this.set('noData', false)
      this.set('loading', true)
      let search = this.get('query') ? `/search?name=${this.get('query')}` : ''
      let page = (search ? '&' : '?') + `page=${this.get('pageNumber') - 1}`
      let size = this.get('pageSize')
      let sort = this.get('sort')
      this.get('ajax').request(`/stocks${search}${page}&size=${size}&sort=${sort}`)
        .then(response => {
          const paginationMetaData = {
            firstPage: response.first,
            lastPage: response.last,
            numberOfElementsInPage: response.numberOfElements,
            totalElements: response.totalElements,
            totalPages: response.totalPages
          }
          this.set('paginationMetaData', paginationMetaData)
          if (response.content && Array.isArray(response.content) && !response.content.length) {
            this.set('noData', true)
          } else {
            this.set('stocks', response.content)
          }
        })
        .catch(() => this.set('fetchError', true))
        .then(() => this.set('loading', false))
    }
  }
});
