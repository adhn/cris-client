import gql from 'graphql-tag';

import {POLL_INTERVAL} from './constants'


const QUERY_FETCH_CHECKLIST_TEMPLATES = gql`
query GetChecklistTemplates(
    $q: String,
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int,
) {
    checklistTemplates(
    q: $q,
    sort_by: $sort_by,
    sort_desc: $sort_desc,
    per_page: $per_page,
    page: $page,
    ) {
    total
    per_page
    current_page
    from
    to
      data {
        id
        name
      }
  	}
}
`



export const state = () => ({

    checklistTemplates: [],
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    loading: false,
    active: true
})

export const getters = {
    checklistTemplates: state => state.checklistTemplates,
    total: state => state.total,
    search: state => state.search,
    pagination: state => state.pagination,
    loading: state => state.loading,
    active: state => state.active,
}

export const actions = {
    fetchChecklistTemplates({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }

        return new Promise((resolve, reject) => {  
            let client = this.app.apolloProvider.defaultClient
            commit('loading',true)
            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_CHECKLIST_TEMPLATES,
                variables: { 
                    "q":state.search,
                    "sort_by":state.pagination.sortBy,
                    "sort_desc":state.pagination.descending,
                    "per_page":state.pagination.rowsPerPage,
                    "page":state.pagination.page,
                },
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_CHECKLIST_TEMPLATES',observableQuery)


            observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.checklistTemplates.total)
                    commit('checklistTemplates',response.data.checklistTemplates.data)
                    commit('loading',false)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })
            

            // client.query({
            //     query: QUERY_FETCH_CHECKLIST_TEMPLATES,
            //     variables: { 
            //         "q":state.search,
            //         "sort_by":state.pagination.sortBy,
            //         "sort_desc":state.pagination.descending,
            //         "per_page":state.pagination.rowsPerPage,
            //         "page":state.pagination.page,
            //     },
            //     fetchPolicy: fetchPolicy
            // }).then(response => {
            //     commit('total',response.data.checklistTemplates.total)
            //     commit('checklistTemplates',response.data.checklistTemplates.data)
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
        state.search = '';
    },

    search (state,payload) {
        state.search = payload
    },
    pagination(state,payload) {
        state.pagination = payload
    },
    total(state,payload) {
        state.total = payload
    },
    checklistTemplates(state,payload) {
        state.checklistTemplates = payload
    },
    loading(state,payload) {
        state.loading = payload
    },
    active(state,payload) {
        state.active = payload
    },
}



