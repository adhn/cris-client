import gql from 'graphql-tag';

import {POLL_INTERVAL} from './constants'

const QUERY_FETCH_COMPANIES = gql`
query GetCompanies(
    $q: String,
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int,
    $associatedWithProjects: [Int]
    $associatedWithProjectRoles: [Int]
    $isClient: Boolean,
    $status: String
) {
    companies(
    q: $q,
    sort_by: $sort_by,
    sort_desc: $sort_desc,
    per_page: $per_page,
    page: $page,
    associatedWithProjects: $associatedWithProjects
    associatedWithProjectRoles: $associatedWithProjectRoles
    isClient: $isClient
    status: $status
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
      companyTrashedCount
}
`



export const state = () => ({
    companies: [],
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    companiesLoading: false,
    selectedProjects: [],
    selectedProjectRoles: [],
    isClient: false,
    status: 'ACTIVE',
    trashedCount: 0,
})

export const getters = {
    companies: state => state.companies,
    total: state => state.total,
    search: state => state.search,
    pagination: state => state.pagination,
    companiesLoading: state => state.companiesLoading,
    selectedProjects: state => state.selectedProjects,
    selectedProjectRoles: state => state.selectedProjectRoles,
    isClient: state => state.isClient,
    status: state => state.status,
    trashedCount: state => state.trashedCount,
}

export const actions = {
    fetchCompanies({state,commit},options) {
        return new Promise((resolve, reject) => {
            let fetchPolicy = 'cache-first'
            if(options != null && options.refresh != null) {
                fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
            }  
            let client = this.app.apolloProvider.defaultClient
            commit('companiesLoading',true)

            // client.query({
            //     query: QUERY_FETCH_COMPANIES,
            //     variables: { 
            //         "q":state.search,
            //         "sort_by":state.pagination.sortBy,
            //         "sort_desc":state.pagination.descending,
            //         "per_page":state.pagination.rowsPerPage,
            //         "page":state.pagination.page,
            //         "associatedWithProjects": state.selectedProjects,
            //         "associatedWithProjectRoles": state.selectedProjectRoles,
            //         "isClient": state.isClient,
            //         "status": state.status
            //     },
            //     fetchPolicy: fetchPolicy,
            // }).then(response => {
            //     commit('total',response.data.companies.total)
            //     commit('companies',response.data.companies.data)
            //     commit('companiesLoading',false)
            //     commit('trashedCount',response.data.companyTrashedCount)
            //     resolve(response)
            // }, error => {
            //     reject(error)
            // })

            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_COMPANIES,
                variables: { 
                    "q":state.search,
                    "sort_by":state.pagination.sortBy,
                    "sort_desc":state.pagination.descending,
                    "per_page":state.pagination.rowsPerPage,
                    "page":state.pagination.page,
                    "associatedWithProjects": state.selectedProjects,
                    "associatedWithProjectRoles": state.selectedProjectRoles,
                    "isClient": state.isClient,
                    "status": state.status
                },
                // pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_COMPANIES',observableQuery)

            // console.info('company_list watchQuery',sub)
            // let startPolling = sub.startPolling(POLL_INTERVAL)
            // console.info(startPolling)
            
            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.companies.total)
                    commit('companies',response.data.companies.data)
                    commit('companiesLoading',false)
                    commit('trashedCount',response.data.companyTrashedCount)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })
            
            this.$queryRegistry.addSubscription('QUERY_FETCH_COMPANIES',subscription)
        })
    },
}
export const mutations = {
    resetFilters(state) {
        state.search = ''
        state.selectedProjects = []
        state.selectedProjectRoles = []
        state.isClient = false
        state.status = 'ACTIVE'
        state.pagination.page = 1
        state.pagination.sortBy = ''
        state.pagination.descending = false
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
    companies(state,payload) {        
        state.companies = payload
    },
    companiesLoading(state,payload) {
        state.companiesLoading = payload
    },
    selectedProjects(state,payload) {
        if(!payload) {
            state.selectedProjects = []
        } else {
            state.selectedProjects = payload
        }
    },
    selectedProjectRoles(state,payload) {
        if(!payload) {
            state.selectedProjectRoles = []
        } else {
            state.selectedProjectRoles = payload
        }
    },
    isClient(state,payload) {
        state.isClient = payload
    },
    status(state,payload) {
        state.status = payload
    },
    trashedCount(state,payload) {
        state.trashedCount = payload
    },
    observable(state,payload) {
        state.observable = payload
    },
    paginationPrev(state) {
        if(state.pagination.page > 1) {
            state.pagination.page--
        }
    },
    paginationNext(state) {
        state.pagination.page++
    }
}



