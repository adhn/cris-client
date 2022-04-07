import gql from 'graphql-tag';
import {POLL_INTERVAL, SLOW_POLL_INTERVAL} from './constants'

const GET_PROJECT_TYPES = gql`
query ProjectTypes(
    $sort_by: String
    $sort_desc: Boolean
    $per_page: Int
    $page: Int
  ) {
    projectTypes(

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
    projectTypes: [],
    loading: false,
    total: 0
})

export const getters = {
  projectTypes: state => state.projectTypes,
  loading: state => state.loading,
  total: state => state.total,
}

export const mutations = {
  projectTypes (state,payload) {
    state.projectTypes = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchProjectTypes({state,commit,dispatch}) {
    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery = client.watchQuery({
        query: GET_PROJECT_TYPES,
        pollInterval: SLOW_POLL_INTERVAL
    })
    
    this.$queryRegistry.add('GET_PROJECT_TYPES',observableQuery)

    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('projectTypes',response.data.projectTypes.data)
        commit('total',response.data.projectTypes.total)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_PROJECT_TYPES',subscription)

  
    // const response = await client.query({
    //   query: GET_PROJECT_TYPES,
    // })
    // .then(function(response) {
    //     commit('projectTypes',response.data.projectTypes.data)
    //     commit('total',response.data.projectTypes.total)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });    
},
}
