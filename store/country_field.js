import gql from 'graphql-tag';
import { POLL_INTERVAL,SLOW_POLL_INTERVAL,ALMOST_NEVER_POLL_INTERVAL } from './constants';

const GET_COUNTRIES = gql`
query Countries(
  $sort_by: String
  $sort_desc: Boolean
  $per_page: Int
  $page: Int
) {
  countries(
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
    countries: [],
    loading: false,
    total: 0
})

export const getters = {
  countries: state => state.countries,
  loading: state => state.loading,
  total: state => state.total,
}

export const mutations = {
  countries (state,payload) {
    state.countries = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchCountries({state,commit,dispatch},options) {

    let fetchPolicy = 'cache-first'
    if(options != null && options.refresh != null) {
        fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
    }

    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery = client.watchQuery({
        query: GET_COUNTRIES,
        variables: {
          per_page: 999
        },
        pollInterval: ALMOST_NEVER_POLL_INTERVAL
    })
    
    this.$queryRegistry.add('GET_COUNTRIES',observableQuery)
    
    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('countries',response.data.countries.data)
        commit('total',response.data.countries.total)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_COUNTRIES',subscription)

    

    // const response = await client.query({
    //   query: GET_COUNTRIES,
    //   variables: {
    //     per_page: 999
    //   },
    //   fetchPolicy: fetchPolicy
    // })
    // .then(function(response) {
    //     commit('countries',response.data.countries.data)
    //     commit('total',response.data.countries.total)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });
},
}
