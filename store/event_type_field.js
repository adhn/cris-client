import gql from 'graphql-tag';
import {POLL_INTERVAL, ALMOST_NEVER_POLL_INTERVAL} from './constants'


const GET_EVENT_TYPES = gql`
query {
  eventTypes {
    id
    name
    key
  }
}
`

export const state = () => ({
    eventTypes: [],
    loading: false,
    total: 0
})

export const getters = {
  eventTypes: state => state.eventTypes,
  loading: state => state.loading,
  total: state => state.total,
  getById: (state) => (id) => {
    return state.eventTypes.find(eventType => eventType.id == id)
  }
}

export const mutations = {
  eventTypes (state,payload) {
    state.eventTypes = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchEventTypes({state,commit,dispatch},options) {
    let fetchPolicy = 'cache-first'
    if(options != null && options.refresh != null) {
        fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
    }

    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery = client.watchQuery({
        query: GET_EVENT_TYPES,
        pollInterval: ALMOST_NEVER_POLL_INTERVAL
    })
    
    this.$queryRegistry.add('GET_EVENT_TYPES',observableQuery)

    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('eventTypes',response.data.eventTypes)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_EVENT_TYPES',subscription)


    // const response = await client.query({
    //   query: GET_EVENT_TYPES,
    //   fetchPolicy: fetchPolicy
    // })
    // .then(function(response) {
    //     commit('eventTypes',response.data.eventTypes)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });    
},
}
