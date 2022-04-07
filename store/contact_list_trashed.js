import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'

// import graphqlClient from '~/plugins/graphql';
// let client = graphqlClient()
// let client = this.app.apolloProvider.defaultClient
// TODO: be aware, a syntax error in graphql query throws a gql not defined
const QUERY_FETCH_TRASHED_CONTACTS = gql`
query FetchTrashedContacts(
  $sort_by: String,
  $sort_desc: Boolean,
  $per_page: Int,
  $page: Int
) {
    trashedContacts(
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
        data{
        id,
        display_name
        job_title
        business_phones
        emailAddresses {
            email
        }
        home_phones
                mobile_phone
        companies {
            id,name
        }
        projects {
            id,name
        }
    }
}
}
`

const MUTATION_RESTORE_CONTACT = gql`
mutation RestoreContactMutation($id:Int!){
    RestoreContact(id:$id)
}
`

export const state = () => ({
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    trashedContacts: [],
    total: 0,
    contactsLoading: false,
})

export const getters = {
    pagination: state => state.pagination,
    trashedContacts: state => state.trashedContacts,
    total: state => state.total,
    contactsLoading: state => state.contactsLoading
}
export const mutations = {
    trashedContacts(state,payload) {
        state.trashedContacts = payload
    },
    total(state,payload) {
        state.total = payload
    },
    pagination(state,payload) {
        state.pagination = payload
    },
    contactsLoading(state,payload) {
        state.contactsLoading = payload
    },
    removeContactItem(state,contactItem) {
        let copy = [...state.trashedContacts]
        let idx = copy.indexOf(contactItem)
        copy.splice(idx,1)
        state.trashedContacts = copy
    }
}
export const actions = {
    async fetchTrashed({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        let client = this.app.apolloProvider.defaultClient
        commit('contactsLoading',true)
        let observableQuery = client.watchQuery({
            query: QUERY_FETCH_TRASHED_CONTACTS,
            variables: {
                "sort_by":state.pagination.sortBy,
                "sort_desc":state.pagination.descending,
                "per_page":state.pagination.rowsPerPage,
                "page":state.pagination.page
            },
            pollInterval: POLL_INTERVAL
        })
        
        this.$queryRegistry.add('QUERY_FETCH_TRASHED_CONTACTS',observableQuery)

        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('contactsLoading',false)
                commit('trashedContacts',response.data.trashedContacts.data)
                commit('total',response.data.trashedContacts.total)
            },
            error: (error, done) => {

            }
        })
        this.$queryRegistry.addSubscription('QUERY_FETCH_TRASHED_CONTACTS',subscription)

        
    

        // const response = await client.query({
        //     query: QUERY_FETCH_TRASHED_CONTACTS,
        //     variables: {
        //         "sort_by":state.pagination.sortBy,
        //         "sort_desc":state.pagination.descending,
        //         "per_page":state.pagination.rowsPerPage,
        //         "page":state.pagination.page
        //     },
        //     fetchPolicy: fetchPolicy
        // }).then(function(response) {
        //     commit('contactsLoading',false)
        //     commit('trashedContacts',response.data.trashedContacts.data)
        //     commit('total',response.data.trashedContacts.total)
        //     return
        // })


    },
    async restoreContact({commit,state,dispatch},contactItem) {
        let client = this.app.apolloProvider.defaultClient
        commit('contactsLoading',true)
        const response = await client.mutate({
            mutation: MUTATION_RESTORE_CONTACT,
            variables: { id: contactItem.id },
        }).then(function(response) {
            if(response.data.RestoreContact) {
                commit('contactsLoading',false)
                commit('removeContactItem',contactItem)
                commit('feedback_snackbar/showSnackbar',{
                    text: 'Contact Restored Succesfully'
                },{ root: true })
                return
            }
        }).catch(function(response) {
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when restoring contact'+JSON.stringify(response),
                color: 'error',
                timeout: 10000
            },{ root: true })
        });
    },
}