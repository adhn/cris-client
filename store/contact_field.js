import gql from 'graphql-tag';
import {POLL_INTERVAL,SLOW_POLL_INTERVAL} from './constants'

const GET_CONTACTS = gql`
query Contacts(
  $sort_by: String
  $sort_desc: Boolean
  $per_page: Int
  $page: Int
) {
  contacts(
    sort_by:$sort_by
    sort_desc:$sort_desc
    per_page:$per_page
    page: $page

  ) {
     total
    data {
      id
      display_name
    }
  }
}
`

export const state = () => ({
    contacts: [],
    loading: false,
    total: 0
})

export const getters = {
  contacts: state => state.contacts,
  loading: state => state.loading,
  total: state => state.total,
}

export const mutations = {
  contacts (state,payload) {
    state.contacts = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchContacts({state,commit,dispatch},options) {
    let fetchPolicy = 'cache-first'
    if(options != null && options.refresh != null) {
        fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
    }
    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery = client.watchQuery({
        query: GET_CONTACTS,
        variables: {
          per_page: 999
        },
        pollInterval: SLOW_POLL_INTERVAL
    })
    
    this.$queryRegistry.add('GET_CONTACTS',observableQuery)
    
    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('contacts',response.data.contacts.data)
        commit('total',response.data.contacts.total)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_CONTACTS',subscription)


    // const response = await client.query({
    //   query: GET_CONTACTS,
    //   variables: {
    //     per_page: 999
    //   },
    //   fetchPolicy:fetchPolicy
    // })
    // .then(function(response) {
    //     commit('contacts',response.data.contacts.data)
    //     commit('total',response.data.contacts.total)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });



},
}
