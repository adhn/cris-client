import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'


const GET_INTERACTIONS = gql`
query Interactions(
  $sort_by: String
  $sort_desc: Boolean
  $per_page: Int
  $page: Int
) {
  interactions(
    sort_by:$sort_by
    sort_desc:$sort_desc
    per_page:$per_page
    page: $page
  ) {
     total
    data {
      id
      title
    }
  }
}
`

export const state = () => ({
    interactions: [],
    loading: false,
    total: 0
})

export const getters = {
  interactions: state => state.interactions,
  loading: state => state.loading,
  total: state => state.total,
}

export const mutations = {
  interactions (state,payload) {
    state.interactions = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchInteractions({state,commit,dispatch},options) {
    let fetchPolicy = 'cache-first'
    if(options != null && options.refresh != null) {
        fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
    }
    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery = client.watchQuery({
        query: GET_INTERACTIONS,
        variables: {
          per_page: 999
        },
        pollInterval:POLL_INTERVAL
    })
    this.$queryRegistry.add('GET_INTERACTIONS',observableQuery)
    
    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('interactions',response.data.interactions.data)
        commit('total',response.data.interactions.total)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_INTERACTIONS',subscription)



    // const response = await client.query({
    //     query: GET_INTERACTIONS,
    //     variables: {
    //       per_page: 999
    //     },
    //     fetchPolicy: fetchPolicy
    // })
    // .then(function(response) {
    //     commit('interactions',response.data.interactions.data)
    //     commit('total',response.data.interactions.total)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });    
},
}
