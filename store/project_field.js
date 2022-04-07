import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'


const GET_PROJECTS = gql`
query {
    projects(
        per_page: 99999,
        page: 1
    ) {
        total
        data {
            id
            name
            category_id
        }
    }
}
`
export const state = () => ({
    projects: [],
    loading: false,
    total: 0
})

export const getters = {
    projects: state => state.projects,
    loading: state => state.loading,
    total: state => state.total,
    getById: (state) => (id) => {
        return state.projects.find(project => project.id == id)
    }
}

export const mutations = {
    projects (state,payload) {
        state.projects = payload
    }, 
    loading (state,payload) {
        state.loading = payload
    },
    total (state,payload) {
        state.total = payload
    }
}

export const actions = {
    async fetchProjects({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        commit('loading',true)
        let observableQuery = await client.watchQuery({
            query: GET_PROJECTS,
            pollInterval: POLL_INTERVAL
        })
        
        this.$queryRegistry.add('GET_PROJECTS',observableQuery)

        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('projects',response.data.projects.data)
                commit('total',response.data.projects.total)
                commit('loading',false)
            },
            error: (error, done) => {

            }
        })
        this.$queryRegistry.addSubscription('GET_PROJECTS',subscription)



        // const response = await client.query({
        //     query: GET_PROJECTS,
        // })
        // .then(function(response) {
        //     commit('projects',response.data.projects.data)
        //     commit('total',response.data.projects.total)
        //     commit('loading',false)
        // })
        // .catch(function(error){
    
        // });

    },
}