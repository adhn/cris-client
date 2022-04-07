import gql from 'graphql-tag';
import {POLL_INTERVAL, ALMOST_NEVER_POLL_INTERVAL} from './constants'

const GET_CURRENCIES = gql`
query GetCurrencies(
  $sort_by: String
  $sort_desc: Boolean
  $per_page: Int
  $page: Int
) {
  currencies(
    sort_by:$sort_by
    sort_desc:$sort_desc
    per_page:$per_page
    page: $page

  ) {
     total
    data {
      id
      name
      code
    }
  }
}
`

export const state = () => ({
    currencies: [],
    loading: false,
    total: 0
})

export const getters = {
  currencies: state => state.currencies,
  loading: state => state.loading,
  total: state => state.total,
  getCurrencyById: (state) => (id) => {
    return state.currencies.find(currency => currency.id == id)
  }
}

export const mutations = {
  currencies (state,payload) {
    state.currencies = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchCurrencies({state,commit,dispatch},options) {
    let fetchPolicy = 'cache-first'
    if(options != null && options.refresh != null) {
        fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
    }

    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery =  client.watchQuery({
        query: GET_CURRENCIES,
        variables: {
          per_page: 999
        },
        pollInterval: ALMOST_NEVER_POLL_INTERVAL
    })
    
    this.$queryRegistry.add('GET_CURRENCIES',observableQuery)
    
    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('currencies',response.data.currencies.data)
        commit('total',response.data.currencies.total)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_CURRENCIES',subscription)


    // const response = await client.query({
    //   query: GET_CURRENCIES,
    //   variables: {
    //     per_page: 999
    //   },
    //   fetchPolicy: fetchPolicy
    // })
    // .then(function(response) {
    //     commit('currencies',response.data.currencies.data)
    //     commit('total',response.data.currencies.total)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });
  },
}
