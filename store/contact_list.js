import gql from 'graphql-tag';
import {POLL_INTERVAL} from './constants'
import { observable } from 'rxjs';

// import graphqlClient from '~/plugins/graphql';
// let client = graphqlClient()
// let client = this.app.apolloProvider.defaultClient
const MUTATION_DELETE_CONTACT = gql`
mutation DeleteContactMutation($id:Int!){
    DeleteContact(id:$id)
}
`

const QUERY_FETCH_CONTACTS_COMPANIES_PROJECTS = gql`
query FetchContactsCompaniesAndProjects(
    $hasDuplicates: Boolean,
    $associatedWithProjects: [Int!],
    $associatedWithCompanies: [Int!],
    $q: String,
    $sort_by: String,
    $sort_desc: Boolean,
    $per_page: Int,
    $page: Int,
    $companies_per_page: Int,
    $companies_page: Int,
    $projects_per_page: Int,
    $projects_page: Int
) {
contacts(
  hasDuplicates: $hasDuplicates,
  associatedWithProjects: $associatedWithProjects,
  associatedWithCompanies: $associatedWithCompanies,
  q: $q,
  sort_by: $sort_by,
  sort_desc: $sort_desc,
  per_page: $per_page,
  page: $page
) {
    total
  	per_page,
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
        id,name,project_role_id
    }
    duplicateContacts {
        id,graph_resource_path,graph_id,deduplicated
    }
    }
    }
    companies(
        per_page:$companies_per_page,
        page: $companies_page
    ) {
        total
        per_page
        current_page
        from
        to
        data {
            id
            name
        }
    }
    projects(
        per_page: $projects_per_page,
        page: $projects_page
    ) {
        total
        per_page
        current_page
        from
        to
        data {
            id
            name
        }
        
    }
    contactTrashedCount
}
`

const QUERY_FETCH_TRASHED_COUNT = gql`
query FetchContactTrashedCount {
    contactTrashedCount
}
`

const QUERY_FETCH_CONTACTS = gql`
query FetchContacts(
  $hasDuplicates: Boolean,
  $associatedWithProjects: [Int!],
  $associatedWithCompanies: [Int!],
  $q: String,
  $sort_by: String,
  $sort_desc: Boolean,
  $per_page: Int,
  $page: Int
) {
  contacts(
    hasDuplicates: $hasDuplicates,
    associatedWithProjects: $associatedWithProjects,
    associatedWithCompanies: $associatedWithCompanies,
    q: $q,
    sort_by: $sort_by,
    sort_desc: $sort_desc,
    per_page: $per_page,
    page: $page
  ) {
    total
    data{
      id,
      display_name
      job_title
      business_phones
      home_phones
      mobile_phone
      emailAddresses {
            email
      }
      companies {
        id,name
      }
      projects {
        id,name
      }
      duplicateContacts {
        id,graph_resource_path,graph_id,deduplicated
      }
    }
  }
}
`

export const state = () => ({
    first: true,
    contacts: [],
    projects: [],
    companies: [],
    selectedProjects: [],
    selectedCompanies: [],
    hasDuplicates: false,
    total: 0,
    search: '',
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    contactsLoading: false,
    filtersLoading: false,
    trashedCount: 0
})

export const getters = {
            contactsLoading: state => state.contactsLoading,
            filtersLoading: state => state.filtersLoading,
            hasDuplicates: state => state.hasDuplicates,
            selectedCompanies: state => state.selectedCompanies,
            selectedProjects: state => state.selectedProjects,
            contacts: state => state.contacts,
            companies: state => state.companies,
            projects: state => state.projects,
            pagination: state => state.pagination,
            total: state => state.total,
            search: state => state.search,
            trashedCount: state => state.trashedCount
}

export const actions = {
    fetchData({state, dispatch, commit }) {
        if(state.first) {
            return dispatch('fetchAllDataFromGraphQL').then(function() {
                commit('first',false)
            })
        } else {
            return dispatch('fetchContactsFromGraphQL')
        }
    },
    async fetchAllDataFromGraphQL({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        console.info('fetchAllDataFromGraphQL called')
        let client = this.app.apolloProvider.defaultClient
        commit('filtersLoading',true)
        commit('contactsLoading',true)
        let observableQuery = client.watchQuery({
            query: QUERY_FETCH_CONTACTS_COMPANIES_PROJECTS,
            variables: { 
                "associatedWithProjects": state.selectedProjects,
                "associatedWithCompanies": state.selectedCompanies,
                "hasDuplicates": state.hasDuplicates,
                "q":state.search,
                "sort_by":state.pagination.sortBy,
                "sort_desc":state.pagination.descending,
                "per_page":state.pagination.rowsPerPage,
                "page":state.pagination.page,
                "companies_per_page":99999, //disabling companies pagination
                "companies_page": 1,
                "projects_per_page": 99999, // disabling projects pagination
                "projects_page": 1
            },
            pollInterval: POLL_INTERVAL
        })
        
        this.$queryRegistry.add('QUERY_FETCH_CONTACTS_COMPANIES_PROJECTS',observableQuery)
        
        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('total',response.data.contacts.total)
                commit('companies',response.data.companies.data)
                commit('projects',response.data.projects.data)
                commit('contacts',response.data.contacts.data)
                commit('filtersLoading',false)
                commit('contactsLoading',false)
                commit('trashedCount',response.data.contactTrashedCount)
            },
            error: (error, done) => {

            }
        })
        this.$queryRegistry.addSubscription('QUERY_FETCH_CONTACTS_COMPANIES_PROJECTS',subscription)

        // const response = await client.query({
        //     query: QUERY_FETCH_CONTACTS_COMPANIES_PROJECTS,
        //     variables: { 
        //         "associatedWithProjects": state.selectedProjects,
        //         "associatedWithCompanies": state.selectedCompanies,
        //         "q":state.search,
        //         "sort_by":state.pagination.sortBy,
        //         "sort_desc":state.pagination.descending,
        //         "per_page":state.pagination.rowsPerPage,
        //         "page":state.pagination.page,
        //         "companies_per_page":99999, //disabling companies pagination
        //         "companies_page": 1,
        //         "projects_per_page": 99999, // disabling projects pagination
        //         "projects_page": 1
        //     },
        //     fetchPolicy: fetchPolicy
        // }).then(function(response) {
        //     console.info(response)
        //     commit('total',response.data.contacts.total)
        //     commit('companies',response.data.companies.data)
        //     commit('projects',response.data.projects.data)
        //     commit('contacts',response.data.contacts.data)
        //     commit('filtersLoading',false)
        //     commit('contactsLoading',false)
        //     commit('trashedCount',response.data.contactTrashedCount)
        // })
    },
    fetchContactTrashedCount({state,commit},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        return new Promise((resolve, reject) => {  
            console.info('fetchContactTrashedCount')
            let client = this.app.apolloProvider.defaultClient
            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_TRASHED_COUNT,
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_TRASHED_COUNT',observableQuery)

            let subscription = observableQuery.subscribe({
                next: (response) => {
                    resolve(response)
                    commit('trashedCount',response.data.contactTrashedCount)
                },
                error: (error, done) => {
                    reject(error)
                }
            })

            this.$queryRegistry.addSubscription('QUERY_FETCH_TRASHED_COUNT',subscription)

            // client.query({
            //     query: QUERY_FETCH_TRASHED_COUNT,
            //     fetchPolicy: fetchPolicy
            // }).then(response => {
            //     console.info('fetchContactTrashedCount response',response)
            //     resolve(response)
            //     commit('trashedCount',response.data.contactTrashedCount)
            // },error => {
            //     console.info(error)
            //     reeject(error)
            // })

        })

    },
    fetchContactsFromGraphQL({state,commit},options) {

        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }

        console.info('fetchContactsFromGraphQL called')
        return new Promise((resolve, reject) => {  
            let client = this.app.apolloProvider.defaultClient
            commit('contactsLoading',true)
            let observableQuery = client.watchQuery({
                query: QUERY_FETCH_CONTACTS,
                variables: { 
                    "hasDuplicates": state.hasDuplicates,
                    "associatedWithProjects": state.selectedProjects,
                    "associatedWithCompanies": state.selectedCompanies,
                    "q":state.search,
                    "sort_by":state.pagination.sortBy,
                    "sort_desc":state.pagination.descending,
                    "per_page":state.pagination.rowsPerPage,
                    "page":state.pagination.page
                },
                pollInterval: POLL_INTERVAL
            })
            
            this.$queryRegistry.add('QUERY_FETCH_CONTACTS',observableQuery)

            let subscription = observableQuery.subscribe({
                next: (response) => {
                    commit('total',response.data.contacts.total)
                    commit('contacts',response.data.contacts.data)
                    commit('contactsLoading',false)
                    resolve(response)
                },
                error: (error, done) => {
                    reject(error)
                }
            })
            this.$queryRegistry.addSubscription('QUERY_FETCH_CONTACTS',subscription)
            

            // client.query({
            //     query: QUERY_FETCH_CONTACTS,
            //     variables: { 
            //         "associatedWithProjects": state.selectedProjects,
            //         "associatedWithCompanies": state.selectedCompanies,
            //         "q":state.search,
            //         "sort_by":state.pagination.sortBy,
            //         "sort_desc":state.pagination.descending,
            //         "per_page":state.pagination.rowsPerPage,
            //         "page":state.pagination.page
            //     },
            //     fetchPolicy: fetchPolicy
            // }).then(response => {
            //     console.info('fetchContactsFromGraphQL response',response)
            //     commit('total',response.data.contacts.total)
            //     commit('contacts',response.data.contacts.data)
            //     commit('contactsLoading',false)
            //     resolve(response)
            // }, error => {
            //     console.info(error)
            //     reject(error)
            // })
        })
    },
    deleteContact({commit,state,dispatch},contactItem) {
        console.info('deleteContact called')
        return new Promise((resolve, reject) => {
            let client = this.app.apolloProvider.defaultClient
            commit('contactsLoading',true)
            client.mutate({
                mutation: MUTATION_DELETE_CONTACT,
                variables: { id: contactItem.id },
            }).then(response => {
                console.info('deleteContact response',response)
                // commit('removeContactItem',contactItem)
                commit('contactsLoading',false)
                commit('feedback_snackbar/showSnackbar',{
                        text: 'Contact Deleted Succesfully'
                    },{root:true})
                resolve(response);
            }, error => {
                commit('feedback_snackbar/showSnackbar',{
                    text: 'Error when deleting contact'+JSON.stringify(error),
                    color: 'error',
                    timeout: 10000
                },{root:true})
                reject(error);
            })
        })    
    },
}
export const mutations = {
    removeContactItem(state,contactItem) {
        let copy = [...state.contacts]
        let idx = copy.indexOf(contactItem)
        copy.splice(idx,1)
        state.contacts = copy
    },
    resetFilters(state) {
        state.search = '';
        state.selectedCompanies = []
        state.selectedProjects = []
        state.hasDuplicates = false
        state.pagination.page = 1
        state.pagination.sortBy = ''
        state.pagination.descending = false
    },
    hasDuplicates (state,payload) {
        state.hasDuplicates = payload
        console.info('contact_list hasDuplicates',state.hasDuplicates)
    },
    selectedProjects (state,payload) {
        state.selectedProjects = payload
    },
    selectedCompanies (state,payload) {
        state.selectedCompanies = payload
    },
    search (state,payload) {
        state.search = payload
    },
    pagination(state,payload) {
        console.info('mutation pagination',payload)
        state.pagination = payload
        // console.info(state.pagination)
    },
    first(state,payload) {
        state.first = payload
    },
    total(state,payload) {
        state.total = payload
    },
    companies(state,payload) {
        state.companies = payload
    },
    projects(state,payload) {
        state.projects = payload
    },
    contacts(state,payload) {
        state.contacts = payload
    },
    filtersLoading(state,payload) {
        state.filtersLoading = payload
    },
    contactsLoading(state,payload) {
        state.contactsLoading = payload
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



