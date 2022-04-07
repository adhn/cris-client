import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'

const QUERY_FETCH_NOTES = gql`
query GetNotes(
    $q: String
    $sort_by: String
    $sort_desc: Boolean
    $per_page: Int
    $page: Int
    $belongingToCompany: Int
    $belongingToProject: Int
    $belongingToEvent: Int
    $createdByUser: Int
    $dateFrom: String
    $dateTo: String
) {
    notes(
    q: $q
    sort_by: $sort_by
    sort_desc: $sort_desc
    per_page: $per_page
    page: $page
    belongingToCompany: $belongingToCompany
    belongingToProject: $belongingToProject
    belongingToEvent: $belongingToEvent
    createdByUser: $createdByUser
    dateFrom: $dateFrom
    dateTo: $dateTo
    ) {
    total
    per_page
    current_page
    from
    to
      data {
        id
        note
        created_at
        company {
            id,name
        }
        project {
            id,name
        }
        user {
            id,name
        }
      }
  	}
}
`



export const state = () => ({
    notes: [],
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    notesLoading: false,
    belongingToCompany: null,
    belongingToProject: null,
    belongingToEvent: null,
    createdByUser: null,
    dateFrom: '',
    dateTo: '',
})


export const getters = {
    notes: state => state.notes,
    total: state => state.total,
    search: state => state.search,
    pagination: state => state.pagination,
    notesLoading: state => state.notesLoading,
    belongingToCompany: state => state.belongingToCompany,
    belongingToProject:state => state.belongingToProject,
    belongingToEvent: state => state.belongingToEvent,
    createdByUser: state => state.createdByUser,
    dateFrom: state => state.dateFrom,
    dateTo: state => state.dateTo,
}
export const mutations = {
    resetFilters(state) {
        state.search = ''
        state.belongingToCompany = null
        state.belongingToProject = null
        state.belongingToEvent = null
        state.createdByUser = null
        state.dateFrom = ''
        state.dateTo = ''
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
    notes(state,payload) {
        state.notes = payload
    },
    notesLoading(state,payload) {
        state.notesLoading = payload
    },
    belongingToCompany(state,payload) {
        state.belongingToCompany = payload
    },
    belongingToProject(state,payload) {
        state.belongingToProject = payload
    },
    belongingToEvent(state,payload) {
        state.belongingToEvent = payload
    },
    createdByUser(state,payload) {
        state.createdByUser = payload
    },
    dateFrom(state,payload) {
        state.dateFrom = payload
    },
    dateTo(state,payload) {
        state.dateTo = payload
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

export const actions = {
    fetchNotes({state,commit},options) {
        return new Promise((resolve, reject) => {
            let fetchPolicy = 'cache-first'
            if(options != null && options.refresh != null) {
                fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
            }
            let client = this.app.apolloProvider.defaultClient
            commit('notesLoading',true)
            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_NOTES,
                variables: { 
                    "q":state.search,
                    "sort_by":state.pagination.sortBy,
                    "sort_desc":state.pagination.descending,
                    "per_page":state.pagination.rowsPerPage,
                    "page":state.pagination.page,
                    "belongingToCompany": state.belongingToCompany,
                    "belongingToProject": state.belongingToProject,
                    "belongingToEvent": state.belongingToEvent,
                    "createdByUser": state.createdByUser,
                    "dateFrom": state.dateFrom,
                    "dateTo": state.dateTo
                },
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_NOTES',observableQuery)

            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.notes.total)
                    commit('notes',response.data.notes.data)
                    commit('notesLoading',false)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })

            this.$queryRegistry.addSubscription('QUERY_FETCH_NOTES',subscription)


            // client.query({
            //     query: QUERY_FETCH_NOTES,
            //     variables: { 
            //         "q":state.search,
            //         "sort_by":state.pagination.sortBy,
            //         "sort_desc":state.pagination.descending,
            //         "per_page":state.pagination.rowsPerPage,
            //         "page":state.pagination.page,
            //         "belongingToCompany": state.belongingToCompany,
            //         "belongingToProject": state.belongingToProject,
            //         "belongingToEvent": state.belongingToEvent,
            //         "createdByUser": state.createdByUser,
            //         "dateFrom": state.dateFrom,
            //         "dateTo": state.dateTo
            //     },
            //     fetchPolicy: fetchPolicy
            // }).then(response => {
            //     commit('total',response.data.notes.total)
            //     commit('notes',response.data.notes.data)
            //     commit('notesLoading',false)
            //     resolve(response)
            // }, error => {
            //     reject(error)
            // })
        })
    },
}




