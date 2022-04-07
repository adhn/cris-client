import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'

const GET_USERS = gql`
query {
    users(
        per_page: 99999,
        page: 1
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
    users: [],
    loading: false,
    total: 0
})

export const getters = {
    users: state => state.users,
    loading: state => state.loading,
    total: state => state.total,
}

export const mutations = {
    users (state,payload) {
        state.users = payload
    }, 
    loading (state,payload) {
        state.loading = payload
    },
    total (state,payload) {
        state.total = payload
    }
}

export const actions = {
    async fetchUsers({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        commit('loading',true)
        let observableQuery = client.watchQuery({
            query: GET_USERS,
            pollInterval: POLL_INTERVAL
        })
        
        this.$queryRegistry.add('GET_USERS',observableQuery)

        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('users',response.data.users.data)
                commit('total',response.data.users.total)
                commit('loading',false)
            },
            error: (error, done) => {

            }
        })
        this.$queryRegistry.addSubscription('GET_USERS',subscription)



        // const response = await client.query({
        //     query: GET_USERS,
        // })
        // .then(function(response) {
        //     commit('users',response.data.users.data)
        //     commit('total',response.data.users.total)
        //     commit('loading',false)
        // })
        // .catch(function(error){
    
        // });
    },
}