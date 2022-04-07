import gql from 'graphql-tag';
import {POLL_INTERVAL,SLOW_POLL_INTERVAL} from './constants'

const GET_CHECKLIST_TEMPLATES = gql`
query {
  checklistTemplates {
    total
    per_page
    current_page
    from
    to
    data {
      id
      name
      checklistItems {
        id
        name
        status
        due_date
        due_date_iso8601
        due_date_tentative
        note
      }
    }
    
  }
}
`

export const state = () => ({
    checklistTemplates: [],
    loading: false,
    total: 0
})

export const getters = {
  checklistTemplates: state => state.checklistTemplates,
  loading: state => state.loading,
  total: state => state.total,
  getById: (state) => (id) => {
    return state.checklistTemplates.find(checklistTemplate => checklistTemplate.id == id)
  }
}

export const mutations = {
  checklistTemplates (state,payload) {
    state.checklistTemplates = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
  total (state,payload) {
    state.total = payload
  }
}

export const actions = {
  async fetchChecklistTemplates({state,commit,dispatch},options) {

    let fetchPolicy = 'cache-first'
    if(options != null && options.refresh != null) {
        fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
    }

    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery = client.watchQuery({
        query: GET_CHECKLIST_TEMPLATES,
        pollInterval: SLOW_POLL_INTERVAL
    })
    
    this.$queryRegistry.add('GET_CHECKLIST_TEMPLATES',observableQuery)
    
    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('checklistTemplates',response.data.checklistTemplates.data)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_CHECKLIST_TEMPLATES',subscription)



    // const response = await client.query({
    //     query: GET_CHECKLIST_TEMPLATES,
    //     fetchPolicy: fetchPolicy
    // })
    // .then(function(response) {
    //     commit('checklistTemplates',response.data.checklistTemplates.data)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });
},
}
