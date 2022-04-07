import gql from 'graphql-tag';

import {POLL_INTERVAL} from './constants'


const QUERY_COMPANY_LIST_TRASHED = gql`
query FetchTrashedCompanies(
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int
  ) {
      trashedCompanies(
        sort_by: $sort_by,
        sort_desc: $sort_desc,
        per_page: $per_page,
        page: $page
      ) {
          total
          per_page
          current_page
          from
          to
          data {
            id
            name
            is_client
            status
            category_id
            projects {
                id,name,project_role_id,active
            }
          }
        }
  }
`

const MUTATION_RESTORE = gql`
mutation RestoreCompanyMutation($id:Int!){
    RestoreCompany(id:$id)
}
`

export const state = () => ({
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    trashedItems: [],
    total: 0,
    loading: false,
})


export const getters = {
    pagination: state => state.pagination,
    trashedItems: state => state.trashedItems,
    total: state => state.total,
    loading: state => state.loading
}

export const mutations = {
    trashedItems(state,payload) {
        state.trashedItems = payload
    },
    total(state,payload) {
        state.total = payload
    },
    pagination(state,payload) {
        state.pagination = payload
    },
    loading(state,payload) {
        state.loading = payload
    },
    removeItem(state,item) {
        let copy = [...state.trashedItems]
        let idx = copy.indexOf(item)
        copy.splice(idx,1)
        state.trashedItems = copy
    }
}

export const actions = {
    async fetch({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        let client = this.app.apolloProvider.defaultClient
        commit('loading',true)
        // const response = await client.query({
        //     query: QUERY_TRASHED,
        //     variables: {
        //         "sort_by":state.pagination.sortBy,
        //         "sort_desc":state.pagination.descending,
        //         "per_page":state.pagination.rowsPerPage,
        //         "page":state.pagination.page
        //     },
        //     fetchPolicy: fetchPolicy,
        // }).then(function(response) {
        //     commit('loading',false)
        //     commit('trashedItems',response.data.trashedCompanies.data)
        //     commit('total',response.data.trashedCompanies.total)
        // })

        let observableQuery = client.watchQuery({
            query: QUERY_COMPANY_LIST_TRASHED,
            variables: {
                "sort_by":state.pagination.sortBy,
                "sort_desc":state.pagination.descending,
                "per_page":state.pagination.rowsPerPage,
                "page":state.pagination.page
            },
            pollInterval: POLL_INTERVAL
        })
        
        this.$queryRegistry.add('QUERY_COMPANY_LIST_TRASHED',observableQuery)

        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('loading',false)
                commit('trashedItems',response.data.trashedCompanies.data)
                commit('total',response.data.trashedCompanies.total)
            },
            error: (error, done) => {

            }
        })
        this.$queryRegistry.addSubscription('QUERY_COMPANY_LIST_TRASHED',subscription)

    },
    async restore({commit,state,dispatch},item) {
        let client = this.app.apolloProvider.defaultClient
        commit('loading',true)
        const response = await client.mutate({
            mutation: MUTATION_RESTORE,
            variables: { id: item.id },
        }).then(function(response) {
            if(response.data.RestoreCompany) {
                commit('loading',false)
                commit('removeItem',item)
                commit('feedback_snackbar/showSnackbar',{
                    text: 'Company Restored Succesfully'
                },{ root: true })
                dispatch('fetch',{refresh:true})
                dispatch('company_list/fetchCompanies',{refresh:true},{root:true})
            }
        }).catch(function(response) {
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when restoring company'+JSON.stringify(response),
                color: 'error',
                timeout: 10000
            },{ root: true })
        });
    },
}