import gql from 'graphql-tag';
import {POLL_INTERVAL, ALMOST_NEVER_POLL_INTERVAL} from './constants'

const GET_INTERACTION_TYPES = gql`
query interactionTypes(
    $sort_by: String
    $sort_desc: Boolean
    $per_page: Int
    $page: Int
  ) {
    interactionTypes(
      sort_by:$sort_by
      sort_desc:$sort_desc
      per_page:$per_page
      page: $page
    ) {
     	total
      data {
        id
        name
      }
    }
}
`

export const state = () => ({
    interactionTypes: [],
    loading: false,
    total: 0
})

export const getters = {
  interactionTypes: state => state.interactionTypes,
  loading: state => state.loading,
  total: state => state.total,
}

export const mutations = {
  interactionTypes (state,payload) {
    state.interactionTypes = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchInteractionTypes({state,commit,dispatch},options) 
  {
      let fetchPolicy = 'cache-first'
      if(options != null && options.refresh != null) {
          fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
      }
      let client = this.app.apolloProvider.defaultClient
      commit('loading',true)
      let observableQuery = client.watchQuery({
          query: GET_INTERACTION_TYPES,
          pollInterval: ALMOST_NEVER_POLL_INTERVAL
      })
      
      this.$queryRegistry.add('GET_INTERACTION_TYPES',observableQuery)

      let subscription = observableQuery.subscribe({
        next: (response) => {
          commit('interactionTypes',response.data.interactionTypes.data)
          commit('total',response.data.interactionTypes.total)
          commit('loading',false)
        },
        error: (error, done) => {

        }
      })
      this.$queryRegistry.addSubscription('GET_INTERACTION_TYPES',subscription)


    //   const response = await client.query({
    //     query: GET_INTERACTION_TYPES,
    //     fetchPolicy: fetchPolicy
    // })
    // .then(function(response) {
    //     commit('interactionTypes',response.data.interactionTypes.data)
    //     commit('total',response.data.interactionTypes.total)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });      
  }
}
