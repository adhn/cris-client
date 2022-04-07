import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'

const GET_EVENTS = gql`
query {
    events(
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
    events: [],
    loading: false,
    total: 0
})

export const getters = {
    events: state => state.events,
    loading: state => state.loading,
    total: state => state.total,
}

export const mutations = {
    events (state,payload) {
        state.events = payload
    }, 
    loading (state,payload) {
        state.loading = payload
    },
    total (state,payload) {
        state.total = payload
    }
}

export const actions = {
    async fetchEvents({state,commit,dispatch},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        let client = this.app.apolloProvider.defaultClient
        commit('loading',true)
        let observableQuery =  client.watchQuery({
            query: GET_EVENTS,
            pollInterval: POLL_INTERVAL
        })
        
        this.$queryRegistry.add('GET_EVENTS',observableQuery)
        
        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('events',response.data.events.data)
                commit('total',response.data.events.total)
                commit('loading',false)
            },
            error: (error, done) => {

            }
        })

        this.$queryRegistry.addSubscription('GET_EVENTS',subscription)


        // const response = await client.query({
        //     query: GET_EVENTS,
        //     fetchPolicy: fetchPolicy
        // })
        // .then(function(response) {
        //     commit('events',response.data.events.data)
        //     commit('total',response.data.events.total)
        //     commit('loading',false)
        // })
        // .catch(function(error){
    
        // });
    },
}