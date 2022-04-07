import gql from 'graphql-tag';

import {POLL_INTERVAL} from './constants'


const QUERY_TRASHED_PROJECTS = gql`
query FetchTrashedProjects(
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int
  ) {
      trashedProjects(
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
            active
            action_date
            progress_todo
            progress_total
            issuerCompany {
                id
                name
            }
            companies {
                id,name,project_role_id
            }
          }
        }
  }
`

const MUTATION_RESTORE = gql`
mutation RestoreProjectMutation($id:Int!){
    RestoreProject(id:$id)
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
        let observableQuery = client.watchQuery({
            query: QUERY_TRASHED_PROJECTS,
            variables: {
                "sort_by":state.pagination.sortBy,
                "sort_desc":state.pagination.descending,
                "per_page":state.pagination.rowsPerPage,
                "page":state.pagination.page
            },
            pollInterval:POLL_INTERVAL
        })
        
        this.$queryRegistry.add('QUERY_TRASHED_PROJECTS',observableQuery)

        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('loading',false)
                commit('trashedItems',response.data.trashedProjects.data)
                commit('total',response.data.trashedProjects.total)
            },
            error: (error, done) => {

            }
        })
        
        this.$queryRegistry.addSubscription('QUERY_TRASHED_PROJECTS',subscription)


        // const response = await client.query({
        //     query: QUERY_TRASHED,
        //     variables: {
        //         "sort_by":state.pagination.sortBy,
        //         "sort_desc":state.pagination.descending,
        //         "per_page":state.pagination.rowsPerPage,
        //         "page":state.pagination.page
        //     },
        //     fetchPolicy: fetchPolicy
        // }).then(function(response) {
        //     commit('loading',false)
        //     commit('trashedItems',response.data.trashedProjects.data)
        //     commit('total',response.data.trashedProjects.total)
        // })


    },
    async restore({commit,state,dispatch},item) {
        let client = this.app.apolloProvider.defaultClient
        commit('loading',true)
        const response = await client.mutate({
            mutation: MUTATION_RESTORE,
            variables: { id: item.id },
        }).then(function(response) {
            if(response.data.RestoreProject) {
                commit('loading',false)
                commit('removeItem',item)
                dispatch('project_list/fetchProjects',{refresh:true},{root:true})
                dispatch('fetch',{refresh:true})
                commit('feedback_snackbar/showSnackbar',{
                    text: 'Project Restored Succesfully'
                },{ root: true })
            }
        }).catch(function(response) {
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when restoring project'+JSON.stringify(response),
                color: 'error',
                timeout: 10000
            },{ root: true })
        });
    },
}