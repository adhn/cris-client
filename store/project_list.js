import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'

const QUERY_FETCH_PROJECTS = gql`
query GetProjects(
    $q: String,
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int,
    $active: Boolean,
    $associatedWithCompanyAsIssuer: Int,
    $associatedWithCompanies: [Int]  
) {
    projects(
        q: $q,
        sort_by: $sort_by,
        sort_desc: $sort_desc,
        per_page: $per_page,
        page: $page,
        active: $active,
        associatedWithCompanyAsIssuer: $associatedWithCompanyAsIssuer,
        associatedWithCompanies: $associatedWithCompanies
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
        created_at
        deleted_at
      }
      }
      projectTrashedCount
}
`
// TODO? remove companies from above query if not needed


export const state = () => ({

    projects: [],
    total: 0,
    search: '',
    associatedWithCompanyAsIssuer: null,
    associatedWithCompanies: [],
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    projectsLoading: false,
    active: true,
    trashedCount: 0,
    activeCount: 0,
})

export const getters = {
    projects: state => state.projects,
    total: state => state.total,
    activeCount: state => state.activeCount,
    search: state => state.search,
    pagination: state => state.pagination,
    projectsLoading: state => state.projectsLoading,
    active: state => state.active,
    trashedCount: state => state.trashedCount,
    associatedWithCompanyAsIssuer: state => state.associatedWithCompanyAsIssuer,
    associatedWithCompanies: state => state.associatedWithCompanies,

}

export const actions = {
    fetchProjects({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }  
        return new Promise((resolve, reject) => {  
            let client = this.app.apolloProvider.defaultClient
            commit('projectsLoading',true)
            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_PROJECTS,
                variables: { 
                    "q":state.search,
                    "sort_by":state.pagination.sortBy,
                    "sort_desc":state.pagination.descending,
                    "per_page":state.pagination.rowsPerPage,
                    "page":state.pagination.page,
                    "active": state.active,
                    "associatedWithCompanyAsIssuer": state.associatedWithCompanyAsIssuer,
                    "associatedWithCompanies": state.associatedWithCompanies
                },
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_PROJECTS',observableQuery)
            
            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.projects.total)
                    commit('activeCount',response.data.projects.data)
                    commit('projects',response.data.projects.data)
                    commit('projectsLoading',false)
                    commit('trashedCount',response.data.projectTrashedCount)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })
            this.$queryRegistry.addSubscription('QUERY_FETCH_PROJECTS',subscription)

        
            // client.query({
            //     query: QUERY_FETCH_PROJECTS,
            //     variables: { 
            //         "q":state.search,
            //         "sort_by":state.pagination.sortBy,
            //         "sort_desc":state.pagination.descending,
            //         "per_page":state.pagination.rowsPerPage,
            //         "page":state.pagination.page,
            //         "active": state.active,
            //         "associatedWithCompanyAsIssuer": state.associatedWithCompanyAsIssuer,
            //         "associatedWithCompanies": state.associatedWithCompanies
            //     },
            //     fetchPolicy:fetchPolicy
            // }).then(response => {
            //     commit('total',response.data.projects.total)
            //     commit('activeCount',response.data.projects.data)
            //     commit('projects',response.data.projects.data)
            //     commit('projectsLoading',false)
            //     commit('trashedCount',response.data.projectTrashedCount)
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
        state.active = true
        state.associatedWithCompanyAsIssuer = null
        state.associatedWithCompanies = []
        state.pagination.page = 1
        state.pagination.sortBy = ''
        state.pagination.descending = false
    },
    activeCount(state,payload) {
        let projectsLength = payload.length
        let count = 0
        for (var i = 0; i < projectsLength; i++) {
            if(payload[i].active) {
                count++
            }
        }
        state.activeCount = count
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
    projects(state,payload) {
        state.projects = payload
    },
    projectsLoading(state,payload) {
        state.projectsLoading = payload
    },
    active(state,payload) {
        state.active = payload
    },
    trashedCount(state,payload) {
        state.trashedCount = payload
    },
    associatedWithCompanyAsIssuer(state,payload) {
        state.associatedWithCompanyAsIssuer = payload
    },
    associatedWithCompanies(state,payload) {
        state.associatedWithCompanies = payload
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



