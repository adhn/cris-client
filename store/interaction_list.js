import gql from 'graphql-tag';

import {POLL_INTERVAL} from './constants'


const QUERY_FETCH_INTERACTIONS = gql`
query GetInteractions(
    $q: String
    $sort_by: String
    $sort_desc: Boolean
    $per_page: Int
    $page: Int
    $dateFrom: String
    $dateTo: String
    $associatedWithProjects: [Int],
    $associatedWithCompanies: [Int],
    $associatedWithContacts: [Int],
    $associatedWithEvents:[Int],
    $belongingToInteractionType: Int
) {
    interactions(
    q: $q
    sort_by: $sort_by
    sort_desc: $sort_desc
    per_page: $per_page
    page: $page
    dateFrom: $dateFrom
    dateTo: $dateTo
    associatedWithProjects: $associatedWithProjects
    associatedWithCompanies: $associatedWithCompanies
    associatedWithContacts: $associatedWithContacts
    associatedWithEvents: $associatedWithEvents
    belongingToInteractionType: $belongingToInteractionType
    ) {
    total
    per_page
    current_page
    from
    to
      data {
        id
        title
        description
        location
        interactionType {
            id,name
        }
        companies {
            id,name
        }
        projects {
            id,name
        }
        contacts {
            id,display_name
        }
        events {
            id,name
        }
        created_at
      }
      }
      interactionTrashedCount
}
`



export const state = () => ({
    interactions: [],
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    interactionsLoading: false,
    associatedWithCompanies: [],
    associatedWithContacts: [],
    associatedWithProjects: [],
    associatedWithEvents: [],
    belongingToInteractionType: null,
    dateFrom: '',
    dateTo: '',
    trashedCount: 0
})


export const getters = {
    interactions: state => state.interactions,
    total: state => state.total,
    search: state => state.search,
    pagination: state => state.pagination,
    interactionsLoading: state => state.interactionsLoading,
    associatedWithCompanies: state => state.associatedWithCompanies,
    associatedWithContacts: state => state.associatedWithContacts,
    associatedWithProjects:  state => state.associatedWithProjects,
    associatedWithEvents: state => state.associatedWithEvents,
    belongingToInteractionType:  state => state.belongingToInteractionType,
    dateFrom: state => state.dateFrom,
    dateTo: state => state.dateTo,
    trashedCount: state => state.trashedCount
}
export const mutations = {
    resetFilters(state) {
        state.search = ''
        state.associatedWithCompanies = []
        state.associatedWithContacts = []
        state.associatedWithProjects = []
        state.associatedWithtEvents = []
        state.belongingToInteractionType = null
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
    interactions(state,payload) {
        state.interactions = payload
    },
    interactionsLoading(state,payload) {
        state.interactionsLoading = payload
    },
    belongingToInteractionType(state,payload) {
        state.belongingToInteractionType = payload
    },
    associatedWithCompanies(state,payload) {
        state.associatedWithCompanies = payload
    },
    associatedWithContacts(state,payload) {
        state.associatedWithContacts = payload
    },
    associatedWithProjects(state,payload) {
        state.associatedWithProjects = payload
    },
    associatedWithEvents(state,payload) {
        state.associatedWithEvents = payload
    },
    dateFrom(state,payload) {
        state.dateFrom = payload
    },
    dateTo(state,payload) {
        state.dateTo = payload
    },
    trashedCount(state,payload) {
        state.trashedCount = payload
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
    fetchInteractions({state,commit},options) {

        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }

        return new Promise((resolve, reject) => {  
            let client = this.app.apolloProvider.defaultClient
            commit('interactionsLoading',true)
            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_INTERACTIONS,
                variables: { 
                    "q":state.search,
                    "sort_by":state.pagination.sortBy,
                    "sort_desc":state.pagination.descending,
                    "per_page":state.pagination.rowsPerPage,
                    "page":state.pagination.page,
                    "associatedWithCompanies": state.associatedWithCompanies,
                    "associatedWithContacts": state.associatedWithContacts,
                    "associatedWithProjects": state.associatedWithProjects,
                    "associatedWithEvents": state.associatedWithEvents,
                    "belongingToInteractionType": state.belongingToInteractionType,
                    "dateFrom": state.dateFrom,
                    "dateTo": state.dateTo
                },
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_INTERACTIONS',observableQuery)
            
            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.interactions.total)
                    commit('interactions',response.data.interactions.data)
                    commit('interactionsLoading',false)
                    commit('trashedCount',response.data.interactionTrashedCount)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })

            this.$queryRegistry.addSubscription('QUERY_FETCH_INTERACTIONS',subscription)


            // client.query({
            //     query: QUERY_FETCH_INTERACTIONS,
            //     variables: { 
            //         "q":state.search,
            //         "sort_by":state.pagination.sortBy,
            //         "sort_desc":state.pagination.descending,
            //         "per_page":state.pagination.rowsPerPage,
            //         "page":state.pagination.page,
            //         "associatedWithCompanies": state.associatedWithCompanies,
            //         "associatedWithContacts": state.associatedWithContacts,
            //         "associatedWithProjects": state.associatedWithProjects,
            //         "associatedWithEvents": state.associatedWithEvents,
            //         "belongingToInteractionType": state.belongingToInteractionType,
            //         "dateFrom": state.dateFrom,
            //         "dateTo": state.dateTo
            //     },
            //     fetchPolicy: fetchPolicy
            // }).then(response => {
            //     commit('total',response.data.interactions.total)
            //     commit('interactions',response.data.interactions.data)
            //     commit('interactionsLoading',false)
            //     commit('trashedCount',response.data.interactionTrashedCount)
            //     resolve(response)
            // }, error => {
            //     reject(error)
            // })

        })
    },
}




