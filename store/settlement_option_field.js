import gql from 'graphql-tag';
import {POLL_INTERVAL, ALMOST_NEVER_POLL_INTERVAL} from './constants'


const GET_SETTLEMENT_OPTIONS = gql`
query getSettlementOptions {
  settlementOptions {
        id
        option
        key
  }
}
`

export const state = () => ({
    settlementOptions: [],
    loading: false,
    total: 0
})

export const getters = {
  settlementOptions: state => state.settlementOptions,
  loading: state => state.loading,
  total: state => state.total,
  getById: (state) => (id) => {
    return state.settlementOptions.find(settlementOption => settlementOption.id == id)
  }
}

export const mutations = {
  settlementOptions (state,payload) {
    state.settlementOptions = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchSettlementOptions({state,commit,dispatch}) {
    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery = client.watchQuery({
        query: GET_SETTLEMENT_OPTIONS,
        pollInterval: ALMOST_NEVER_POLL_INTERVAL
    })
    
    this.$queryRegistry.add('GET_SETTLEMENT_OPTIONS',observableQuery)

    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('settlementOptions',response.data.settlementOptions)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_SETTLEMENT_OPTIONS',subscription)



    // const response = await client.query({
    //     query: GET_SETTLEMENT_OPTIONS,
    // })
    // .then(function(response) {
    //     commit('settlementOptions',response.data.settlementOptions)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });



},
}
