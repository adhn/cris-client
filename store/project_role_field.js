import gql from 'graphql-tag';
import {POLL_INTERVAL, SLOW_POLL_INTERVAL} from './constants'


const GET_PROJECT_ROLES = gql`
query projectRoles {
  projectRoles {
    id
    role
    display
  }
}
`

export const state = () => ({
    projectRoles: [],
    loading: false,
})

export const getters = {
  projectRoles: state => state.projectRoles,
  filteredProjectRoles: state => {
    let displayProjectRoles = _.filter(state.projectRoles, function(o) { 
      return o.display; 
    });
    return displayProjectRoles
  },
  loading: state => state.loading,
  getProjectRoleById: (state) => (id) => {
    return state.projectRoles.find(projectRole => projectRole.id == id)
  }
}

export const mutations = {
  projectRoles (state,payload) {
    state.projectRoles = payload
  }, 
  loading (state,payload) {
    state.loading = payload
  },
}

export const actions = {
  async fetchProjectRoles({state,commit,dispatch}) {
    let client = this.app.apolloProvider.defaultClient
    commit('loading',true)
    let observableQuery = await client.watchQuery({
        query: GET_PROJECT_ROLES,
        pollInterval: SLOW_POLL_INTERVAL
    })
    
    this.$queryRegistry.add('GET_PROJECT_ROLES',observableQuery)

    let subscription = observableQuery.subscribe({
      next: (response) => {
        commit('projectRoles',response.data.projectRoles)
        commit('loading',false)
      },
      error: (error, done) => {

      }
    })
    this.$queryRegistry.addSubscription('GET_PROJECT_ROLES',subscription)


    // const response = await client.query({
    //   query: GET_PROJECT_ROLES,
    // })
    // .then(function(response) {
    //     commit('projectRoles',response.data.projectRoles)
    //     commit('loading',false)
    // })
    // .catch(function(error){

    // });    
},
}
