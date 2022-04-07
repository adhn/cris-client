import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'

const QUERY_GET_EVENT_CHECKLIST_ITEM_AUDITS = gql`
query GetEventChecklistItemAudits(
    $q: String,
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int,
    $dateFrom: String
    $dateTo: String
    $event_id: Int!
  	$user_id: Int
) {
    eventChecklistItemAudits(
      q:$q
      sort_by:$sort_by
      sort_desc:$sort_desc
      per_page:$per_page
      page: $page
      dateFrom: $dateFrom
      dateTo: $dateTo
      event_id: $event_id
      user_id: $user_id
  ) {
    total
    per_page
    current_page
    from
    to
    data {
      id
      event
      user_id
      auditable_type
      auditable_id
      old_values
      new_values
      created_at
      user {
        id,name
      }
    }
  }
}
`



export const state = () => ({
    audits: [],
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    auditsLoading: false,
    dateFrom: '',
    dateTo: '',
    // auditableType: null,
    // auditableId: null,
    eventId:null,
    userId: null,

})


export const getters = {
    audits: state => state.audits,
    total: state => state.total,
    search: state => state.search,
    pagination: state => state.pagination,
    auditsLoading: state => state.auditsLoading,
    dateFrom: state => state.dateFrom,
    dateTo: state => state.dateTo,
    // auditableType: state => state.auditableType,
    // auditableId: state => state.auditableId,
    eventId: state => state.eventId,
    userId: state => state.userId,

}
export const mutations = {
    resetFilters(state) {
        state.search = '';
        state.userId = null;
        state.dateFrom = '';
        state.dateTo = '';
        // state.auditableType = null;
        // state.auditableId = null;
        state.eventId = null
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
    audits(state,payload) {
        state.audits = payload
    },
    auditsLoading(state,payload) {
        state.auditsLoading = payload
    },
    dateFrom(state,payload) {
        state.dateFrom = payload
    },
    dateTo(state,payload) {
        state.dateTo = payload
    },
    // auditableType(state,payload) {
    //     state.auditableType = payload
    // },
    // auditableId(state,payload) {
    //     state.auditableId = payload
    // },
    eventId(state,payload) {
        state.eventId = payload
    },
    userId(state,payload) {
        state.userId = payload
    },
}

export const actions = {
    fetchAudits({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        return new Promise((resolve, reject) => {  
            let client = this.app.apolloProvider.defaultClient
            commit('auditsLoading',true)
            let observableQuery = client.watchQuery({
                query: QUERY_GET_EVENT_CHECKLIST_ITEM_AUDITS,
                variables: { 
                    "q":state.search,
                    "sort_by":state.pagination.sortBy,
                    "sort_desc":state.pagination.descending,
                    "per_page":state.pagination.rowsPerPage,
                    "page":state.pagination.page,
                    "userId": state.userId,
                    "dateFrom": state.dateFrom,
                    "dateTo": state.dateTo,
                    "event_id": state.eventId
                    // "auditable_type": state.auditableType,
                    // "auditable_id": state.auditableId
                },
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_GET_EVENT_CHECKLIST_ITEM_AUDITS',observableQuery)
            
            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.eventChecklistItemAudits.total)
                    commit('audits',response.data.eventChecklistItemAudits.data)
                    commit('auditsLoading',false)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })
            this.$queryRegistry.addSubscription('QUERY_GET_EVENT_CHECKLIST_ITEM_AUDITS',subscription)



            // then(response => {
            //     commit('total',response.data.eventChecklistItemAudits.total)
            //     commit('audits',response.data.eventChecklistItemAudits.data)
            //     commit('auditsLoading',false)
            //     resolve(response)
            // }, error => {
            //     reject(error)
            // })
        })
    },
}




