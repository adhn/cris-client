import gql from 'graphql-tag';

import {POLL_INTERVAL} from './constants'


const QUERY_FETCH_AUDIT_PIVOTS = gql`
query GetAuditPivots(
    $q: String,
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int,
    $dateFrom: String
    $dateTo: String
    $auditable_type: String
    $auditable_id: Int
    $relation_type: String
    $relation_id: Int
  	$user_id: Int
) {
  auditPivots(
      q:$q
      sort_by:$sort_by
      sort_desc:$sort_desc
      per_page:$per_page
      page: $page
      dateFrom: $dateFrom
      dateTo: $dateTo
      auditable_type: $auditable_type
      auditable_id: $auditable_id
      relation_type: $relation_type
      relation_id: $relation_id
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
      relation_type
      relation_id
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
    auditPivots: [],
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    auditPivotsLoading: false,
    dateFrom: '',
    dateTo: '',
    auditableType: null,
    auditableId: null,
    userId: null,
    relationType: null,
    relationId: null,
})


export const getters = {
    auditPivots: state => state.auditPivots,
    total: state => state.total,
    search: state => state.search,
    pagination: state => state.pagination,
    auditPivotsLoading: state => state.auditsLoading,
    dateFrom: state => state.dateFrom,
    dateTo: state => state.dateTo,
    auditableType: state => state.auditableType,
    auditableId: state => state.auditableId,
    relationType: state => state.relationType,
    relationId: state => state.relationId,
    userId: state => state.userId,
    getFieldTypeName: state => {
        if(state.auditableType) {
            return 'relation_type'
        }
        if(state.relationType) {
            return 'auditable_type'
        }
    },
    getFieldIdName: state => {
        if(state.auditableId) {
            return 'relation_id'
        }
        if(state.relationId) {
            return 'auditable_id'
        }
    }

}
export const mutations = {
    resetFilters(state) {
        state.search = '';
        state.userId = null;
        state.dateFrom = '';
        state.dateTo = '';
        state.auditableType = null;
        state.auditableId = null;
        state.relationType = null;
        state.relationId = null;
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
    auditPivots(state,payload) {
        state.auditPivots = payload
    },
    auditPivotsLoading(state,payload) {
        state.auditPivotsLoading = payload
    },
    dateFrom(state,payload) {
        state.dateFrom = payload
    },
    dateTo(state,payload) {
        state.dateTo = payload
    },
    auditableType(state,payload) {
        state.auditableType = payload
    },
    auditableId(state,payload) {
        state.auditableId = payload
    },
    relationType(state,payload) {
        state.relationType = payload
    },
    relationId(state,payload) {
        state.relationId = payload
    },
    userId(state,payload) {
        state.userId = payload
    },
}

export const actions = {
    fetchAuditPivots({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        return new Promise((resolve, reject) => {  
            let client = this.app.apolloProvider.defaultClient
            commit('auditPivotsLoading',true)
            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_AUDIT_PIVOTS,
                variables: { 
                    "q":state.search,
                    "sort_by":state.pagination.sortBy,
                    "sort_desc":state.pagination.descending,
                    "per_page":state.pagination.rowsPerPage,
                    "page":state.pagination.page,
                    "userId": state.userId,
                    "dateFrom": state.dateFrom,
                    "dateTo": state.dateTo,
                    "auditable_type": state.auditableType,
                    "auditable_id": state.auditableId,
                    "relation_type": state.relationType,
                    "relation_id": state.relationId
                },
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_AUDIT_PIVOTS',observableQuery)
            
            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.auditPivots.total)
                    commit('auditPivots',response.data.auditPivots.data)
                    commit('auditPivotsLoading',false)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })
            this.$queryRegistry.addSubscription('QUERY_FETCH_AUDIT_PIVOTS',subscription)

            // client.query({
            //     query: QUERY_FETCH_AUDIT_PIVOTS,
            //     variables: { 
            //         "q":state.search,
            //         "sort_by":state.pagination.sortBy,
            //         "sort_desc":state.pagination.descending,
            //         "per_page":state.pagination.rowsPerPage,
            //         "page":state.pagination.page,
            //         "userId": state.userId,
            //         "dateFrom": state.dateFrom,
            //         "dateTo": state.dateTo,
            //         "auditable_type": state.auditableType,
            //         "auditable_id": state.auditableId,
            //         "relation_type": state.relationType,
            //         "relation_id": state.relationId
            //     },
            //     fetchPolicy: fetchPolicy
            // }).then(response => {
            //     commit('total',response.data.auditPivots.total)
            //     commit('auditPivots',response.data.auditPivots.data)
            //     commit('auditPivotsLoading',false)
            //     resolve(response)
            // }, error => {
            //     reject(error)
            // })
        })
    },
}




