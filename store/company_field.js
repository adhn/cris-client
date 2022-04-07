import gql from 'graphql-tag';
import {POLL_INTERVAL,SLOW_POLL_INTERVAL} from './constants'


const GET_COMPANIES = gql`
query {
    companies(
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

const GET_ISSUER_COMPANIES = gql`
query {
    companies(
        per_page: 99999,
        page: 1,
        isIssuer: true
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
    companies: [],
    loading: false,
    total: 0,
    issuerCompanies: []
})

export const getters = {
    companies: state => state.companies,
    issuerCompanies: state => state.issuerCompanies,
    loading: state => state.loading,
    total: state => state.total,
}

export const mutations = {
    companies (state,payload) {
        state.companies = payload
    }, 
    issuerCompanies (state,payload) {
        state.issuerCompanies = payload
    }, 
    loading (state,payload) {
        state.loading = payload
    },
    total (state,payload) {
        state.total = payload
    }
}

export const actions = {
    async fetchCompanies({state,commit,dispatch},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }

        let client = this.app.apolloProvider.defaultClient
        commit('loading',true)
        let observableQuery = client.watchQuery({
            query: GET_COMPANIES,
            pollInterval: POLL_INTERVAL
        })

        this.$queryRegistry.add('GET_COMPANIES',observableQuery)

        observableQuery.subscribe({
            next: (response) => {
                commit('companies',response.data.companies.data)
                commit('total',response.data.companies.total)
                commit('loading',false)
            },
            error: (error, done) => {

            }
        })

    },
    async fetchIssuerCompanies({state,commit,dispatch},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }

        let client = this.app.apolloProvider.defaultClient
        commit('loading',true)
        let observableQuery = client.watchQuery({
            query: GET_ISSUER_COMPANIES,
            pollInterval: SLOW_POLL_INTERVAL
        })

        this.$queryRegistry.add('GET_ISSUER_COMPANIES',observableQuery)

        observableQuery.subscribe({
            next: (response) => {
                commit('issuerCompanies',response.data.companies.data)
                commit('loading',false)
            },
            error: (error, done) => {

            }
        })
    },
}