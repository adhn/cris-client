import gql from 'graphql-tag';

import {POLL_INTERVAL} from './constants'


const QUERY_FETCH_CHECKLISTS = gql`
query GetChecklist($belongingToProject:Int) {
	checklists(belongingToProject:$belongingToProject) {
		total
    per_page
    current_page
    from
    to
    data {
      id
      name
      status
      progress_todo
      progress_total
      action_date
      created_at
      updated_at
    }
  }
}
`



export const state = () => ({

    checklists: [],
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    loading: false,

    // filters
    belongingToProject: null,

    
})

export const getters = {
    checklists: state => state.checklists,
    total: state => state.total,
    search: state => state.search,
    pagination: state => state.pagination,
    loading: state => state.loading,
    belongingToProject: state => state.belongingToProject,
    

}

export const actions = {
    fetchChecklists({state,commit},options) {

        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }


        return new Promise((resolve, reject) => {  
            let client = this.app.apolloProvider.defaultClient
            commit('loading',true)
            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_CHECKLISTS,
                variables: { 
                    "belongingToProject": state.belongingToProject
                },
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_CHECKLISTS',observableQuery)
            
            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.checklists.total)
                    commit('checklists',response.data.checklists.data)
                    commit('loading',false)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })
            this.$queryRegistry.addSubscription('QUERY_FETCH_CHECKLISTS',subscription)

            // client.query({
            //     query: QUERY_FETCH_CHECKLISTS,
            //     variables: { 
            //         "belongingToProject": state.belongingToProject
            //     },
            //     fetchPolicy: fetchPolicy
            // }).then(response => {
            //     commit('total',response.data.checklists.total)
            //     commit('checklists',response.data.checklists.data)
            //     commit('loading',false)
            //     resolve(response)
            // }, error => {
            //     reject(error)
            // })
        })
    },
}
export const mutations = {
    resetFilters(state) {
        state.search = ''
        state.belongingToProject = null
    },

    pagination(state,payload) { state.pagination = payload },
    total(state,payload) { state.total = payload },
    checklists(state,payload) { 
        state.checklists = payload 
    },
    loading(state,payload) { state.loading = payload },
    belongingToProject (state,payload) { state.belongingToProject = payload },

}



