import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'


const QUERY_FETCH_EVENTS = gql`
query GetEvents(
    $q: String,
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int,
    $status: String,
    $associatedWithProjects: [Int],
    $associatedWithCompanies: [Int],
    $eventType: Int
) {
    events(
    q: $q,
    sort_by: $sort_by,
    sort_desc: $sort_desc,
    per_page: $per_page,
    page: $page,
    status: $status,
    associatedWithProjects: $associatedWithProjects,
    associatedWithCompanies: $associatedWithCompanies,
    eventType: $eventType
    ) {
    total
    per_page
    current_page
    from
    to
      data {
        id
        name
        status
        created_at
        progress_todo
        progress_total
        action_date
        project {
            id
            name
            issuerCompany {
                id
                name
            }
        }
        eventType {
            id
            name
            key
        }
        checklist {
            id
            name
            progress_todo
            progress_total
            action_date
            checklistItems {
                id
                status
                due_date
                due_date_iso8601
                due_date_tentative
            }
        }
      }
      }
      eventTrashedCount
}
`



export const state = () => ({

    events: [],
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    loading: false,

    // filters
    status: 'ACTIVE',
    associatedWithProjects: [],
    associatedWithCompanies: [],
    eventType: null,
    trashedCount: 0
})

export const getters = {
    events: state => state.events,
    total: state => state.total,
    search: state => state.search,
    pagination: state => state.pagination,
    loading: state => state.loading,
    status: state => state.status,
    associatedWithProjects: state => state.associatedWithProjects,
    associatedWithCompanies: state => state.associatedWithCompanies,
    eventType: state => state.eventType,
    trashedCount: state => state.trashedCount
}

export const actions = {
    fetchEvents({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }

        return new Promise((resolve, reject) => {  
            let client = this.app.apolloProvider.defaultClient
            commit('loading',true)
            let observableQuery = client.watchQuery({
            query: QUERY_FETCH_EVENTS,
            variables: { 
                "q":state.search,
                "sort_by":state.pagination.sortBy,
                "sort_desc":state.pagination.descending,
                "per_page":state.pagination.rowsPerPage,
                "page":state.pagination.page,
                "status": state.status,
                "associatedWithProjects": state.associatedWithProjects,
                "associatedWithCompanies": state.associatedWithCompanies,
                "eventType": state.eventType
            },
            pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_EVENTS',observableQuery)    
        
            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.events.total)
                    commit('events',response.data.events.data)
                    commit('trashedCount',response.data.eventTrashedCount)
                    commit('loading',false)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })

            this.$queryRegistry.addSubscription('QUERY_FETCH_EVENTS',subscription)

            // client.query({
            //     query: QUERY_FETCH_EVENTS,
            //     variables: { 
            //         "q":state.search,
            //         "sort_by":state.pagination.sortBy,
            //         "sort_desc":state.pagination.descending,
            //         "per_page":state.pagination.rowsPerPage,
            //         "page":state.pagination.page,
            //         "status": state.status,
            //         "associatedWithProjects": state.associatedWithProjects,
            //         "associatedWithCompanies": state.associatedWithCompanies,
            //         "eventType": state.eventType
            //     },
            //     fetchPolicy: fetchPolicy
            //     }).then(response => {
            //         commit('total',response.data.events.total)
            //         commit('events',response.data.events.data)
            //         commit('trashedCount',response.data.eventTrashedCount)
            //         commit('loading',false)
            //         resolve(response)
            //     }, error => {
            //         reject(error)
            //     })
        })
    },
}
export const mutations = {
    resetFilters(state) {
        state.search = ''
        state.status = null
        state.associatedWithProjects = []
        state.associatedWithCompanies = []
        state.eventType = null
        state.pagination.page = 1
        state.pagination.sortBy = ''
        state.pagination.descending = false
    },

    pagination(state,payload) { state.pagination = payload },
    total(state,payload) { state.total = payload },
    events(state,payload) { 
        state.events = payload 
        // state.events = state.events.map(e => {
        //     if(e.checklist && e.checklist.checklistItems && e.checklist.checklistItems.length > 0) {
        //         let checklistItems = e.checklist.checklistItems
        //         let sortedChecklistItems = _.orderBy(checklistItems, 'due_date_iso8601', 'desc')
        //         return sortedChecklistItems[sortedChecklistItems.length-1].due_date_iso8601
        //     }
        // });
    },
    loading(state,payload) { state.loading = payload },

    search (state,payload) { state.search = payload },
    status (state,payload) { state.status = payload },
    associatedWithProjects (state,payload) { state.associatedWithProjects = payload },
    associatedWithCompanies (state,payload) { state.associatedWithCompanies = payload },
    eventType (state,payload) { state.eventType = payload },
    trashedCount (state,payload) { state.trashedCount = payload },
    paginationPrev(state) {
        if(state.pagination.page > 1) {
            state.pagination.page--
        }
    },
    paginationNext(state) {
        state.pagination.page++
    }

}



