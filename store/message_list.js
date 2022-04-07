import gql from 'graphql-tag';
import { POLL_INTERVAL, SLOW_POLL_INTERVAL } from './constants';


const QUERY_MESSAGES = gql`
query GetMessages(
    $q:String
    $sort_by: String
    $sort_desc: Boolean
    $per_page: Int
    $page: Int
    $dateFrom: String
    $dateTo: String
    $associatedWithProjects: [Int]
    $associatedWithCompanies: [Int]
    $fromContact: Int
    $toContacts: [Int]
    $isUncategorized: Boolean
  ) {
    messages(
      q:$q
      sort_by:$sort_by
      sort_desc:$sort_desc
      per_page:$per_page
      page: $page
      dateFrom: $dateFrom
      dateTo: $dateTo
      associatedWithProjects: $associatedWithProjects
      associatedWithCompanies: $associatedWithCompanies
      fromContact: $fromContact
      toContacts: $toContacts
      isUncategorized: $isUncategorized
    ) {
      total
      per_page
      current_page
      from
      to
      data {
          id
          internet_message_id
          subject
          from
          to_recipients
          bcc_recipients
          cc_recipients
          body_content
          body_content_type
          category_suggestions
          created_date_time 
          companies {
            id
            category_id
          }
          projects {
            id
            category_id
          }
          contacts {
            id,display_name
            emailAddresses {
              id,display_name,email
            }
            field
          }
          users {
            user_id
            created_date_time
            last_modified_date_time
            weblink
            is_read
          }
        attachments {
            id
            graph_id
            last_modified_date_time
            name
            content_type
            size
        }
      }
    }
  }
`

const QUERY_FETCH_COMPANIES_PROJECTS_CONTACTS = gql`
query {
    companies(
        per_page: 99999,
        page: 1
    ) {
        total
        data {
            id
            name
            category_id
        }
    }
    projects(
        per_page: 99999,
        page: 1
    ) {
        total
        data {
            id
            name
            category_id
        }
    }
    contacts(
        per_page: 99999,
        page: 1
    ) {
        total
        data {
            id
            display_name
        }
    }
}
`

const MUTATION_SAVE_MESSAGE_CATEGORIES = gql`
mutation AssociateMessageWithCategories($messageCategories:MessageCategoriesInputType) {
    AssociateMessageWithCategories(MessageCategoriesInput:$messageCategories) {
      id
      companies {
        id
        category_id
      }
      projects {
        id
        category_id
      }
  	}
}
`


const processMessages = function(state,messages) {
    // TODO implement this to match up to, from, cc with contact id's

    var mergedMessages = []
    var abortUserLoop = false;
    var messagesLength = messages.length
    var message = {};
    for (var i = 0; i < messagesLength; i++) {
        
        message = _.assign({},messages[i])

        /**
         * Merging message_user pivot data into message object
         *  created_date_time
         *  last_modified_date_time
         *  weblink
         *  is_read
         */
        // abortUserLoop = false
        // var usersLength = messages[i].users.length
        // for (var j = 0; j < usersLength && !abortUserLoop; j++) {
        //     // console.info('user',messages[i].users[j])
        //     if(messages[i].users[j].user_id == state.user.id) {
        //         // console.info('merged message',i)
        //         message = _.assign({},messages[i],messages[i].users[j])
        //         abortUserLoop = true; // leave inner loop
        //     }
        // }

        /**
         * 
         */
        var contactsLength = messages[i].contacts.length
        var contacts = {
            contact_from: {},
            contact_to_recipients: [],
            contact_cc_recipients: [],
            contact_bcc_recipients: [],
            to_recipients: [],
            cc_recipients: [],
            bcc_recipients: []
        }

        for(var k = 0; k < contactsLength; k++) {
            switch(messages[i].contacts[k].field) {
                case 'FROM':
                    contacts.contact_from = messages[i].contacts[k] 
                    break;
                case 'TO':
                    contacts.to_recipients = removeContactFromRecipientArray(message,messages[i].contacts[k],'to_recipients')
                    contacts.contact_to_recipients.push(messages[i].contacts[k]) 
                    break;
                case 'CC':
                    contacts.cc_recipients = removeContactFromRecipientArray(message,messages[i].contacts[k],'cc_recipients')
                    contacts.contact_cc_recipients.push(messages[i].contacts[k]) 
                    break;
                case 'BCC':
                    contacts.bcc_recipients = removeContactFromRecipientArray(message,messages[i].contacts[k],'bcc_recipients')
                    contacts.contact_bcc_recipients.push(messages[i].contacts[k])
                    break;
            }
            
        }
        // console.info('contacts',contacts)
        message = _.assign(message,contacts)
        // console.info('message',message)

        mergedMessages.push(message)
    }
    // console.info('messages',mergedMessages)
    return mergedMessages
}

const removeContactFromRecipientArray = function(message,contact,recipientArray) {
    var recipients = []
    // iterate contact['emailAddresses'] as emailAddress['email']
    if(contact['emailAddresses']) {
        var emailAddressesLength = contact['emailAddresses'].length
        for (var i = 0; i < emailAddressesLength; i++) {
            var email = contact['emailAddresses'][i].email
            var recipientArrayLength = message[recipientArray].length
            // iterate message[recipientArray] as recipientString
            for (var k = 0; k < recipientArrayLength; k++) {
                var recipientString = message[recipientArray][k]
                // if recipientString contains emailAddress['email']
                var idx = recipientString.indexOf(email)
                // console.info('idx',idx)
                if(idx => 0) {
                    // email was found in recipientString, remove from recipientArray  
                    // console.info('will we ever come here 1')
                    // message[recipientArray].splice(k,1)
                    recipients.push(message[recipientArray][k])
                    // console.info('will we ever come here 2')
                }
            }
        }
    }
    recipients = _.difference(message[recipientArray],recipients)
    // recipients = message[recipientArray]
    return recipients
}

export const state = () => ({
    messages: [],
    pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
    },
    total: 0,
    messagesLoading: false,
    projects: [],
    companies: [],
    categories: [],
    contacts: [],
    filtersLoading: false,


    search: '',
    dateFrom: '',
    dateTo: '',
    selectedProjects: [],
    selectedCompanies: [],
    fromContact: null,
    toContacts: [],
    showUncategorized: false,



})

export const getters = {
    messages: state => state.messages,
    pagination: state => state.pagination,
    total: state => state.total,
    search: state => state.search,
    messagesLoading: state => state.messagesLoading,
    categories: state => state.categories,
    projects: state => state.projects,
    companies: state => state.companies,
    contacts: state => state.contacts,
    selectedProjects: state => state.selectedProjects,
    selectedCompanies: state => state.selectedCompanies,
    dateFrom: state => state.dateFrom,
    dateTo: state => state.dateTo,
    filtersLoading: state => state.filtersLoading,
    fromContact: state => state.fromContact,
    toContacts: state => state.toContacts,
    showUncategorized: state => state.showUncategorized,
    getById: (state) => (id) => {
        return state.messages.find(message => message.id == id)
    }
}

export const mutations = {
    messages(state,payload) {
        state.messages = processMessages(state,payload)
    },
    pagination(state,payload) {
        state.pagination = payload
    },
    search (state,payload) {
        state.search = payload
    },
    total(state,payload) {
        state.total = payload
    },
    messagesLoading(state,payload) {
        state.messagesLoading = payload
    },
    companies(state,payload) {
        state.companies = payload
        let companies =  [...payload]
        _.forEach(companies,function(company) {
            state.categories.push(company)
        })
    },
    projects(state,payload) {
        state.projects = payload
        let projects = [...payload]
        _.forEach(projects,function(project) {
            state.categories.push(project)
        })
    },
    contacts(state,payload) {
        state.contacts = payload
    },
    sortCategories(state) {
        state.categories = _.orderBy(state.categories, ['name'],['asc']); // Use Lodash to sort array by 'name'
    },
    dateFrom(state,payload) {
        state.dateFrom = payload
    },
    dateTo(state,payload) {
        state.dateTo = payload
    },
    filtersLoading(state,payload) {
        state.filtersLoading = payload
    },
    selectedProjects(state,payload) {
        console.info('selectedProjects',payload)
        state.selectedProjects = payload
    },
    selectedCompanies(state,payload) {
        state.selectedCompanies = payload
    },
    fromContact(state,payload) {
        state.fromContact = payload
    },
    toContacts(state,payload) {
        state.toContacts = payload
    },
    resetFilters(state) {
        console.info('message_list/resetFilters')
        state.search = ''
        state.dateFrom = ''
        state.dateTo = ''
        state.selectedCompanies = []
        state.selectedProjects = []
        state.fromContact = null
        state.toContacts = []
        state.pagination.page = 1
        state.pagination.sortBy = ''
        state.pagination.descending = false

    },
    showUncategorized(state,payload) {
        state.showUncategorized = payload
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
    async updateCategories({state,commit,dispatch,getters},payload) {
        // TODO, loading for CategoriesAutoCompleteRender
        // payload.messageId
        // payload.selectedCategories

        // checking if the categories we are setting on the message are different from what is already set
        let message = getters['getById'](payload.messageId)
        let categories = []
        let project_categories = _.map(message.projects, 'category_id')
        categories.push(...project_categories)
        let companies_categories = _.map(message.companies,'category_id')
        categories.push(...companies_categories)

        let diff = _.xor(categories, payload.selectedCategories);
        if(diff.length == 0) {
            return
        }
        console.info('message_list updateCategories diff',diff)


        let client = this.app.apolloProvider.defaultClient
        const response = await client.mutate({
            mutation: MUTATION_SAVE_MESSAGE_CATEGORIES,
            variables: {
                messageCategories: {
                    id: payload.messageId,
                    categories: payload.selectedCategories
                }
            }   
        }).then(function(response) {
            // TODO, update state.messages, map categories to projects and companies
            // dispatch('fetchMessages',{refresh:true})

            // return response
        }).catch(function(error){

        });    
    },
    async fetchMessages({state,commit,dispatch},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        let client = this.app.apolloProvider.defaultClient
        commit('messagesLoading',true)
        let observableQuery = client.watchQuery({
            query: QUERY_MESSAGES,
            variables: {
                "q":state.search,
                "sort_by":state.pagination.sortBy,
                "sort_desc":state.pagination.descending,
                "per_page":state.pagination.rowsPerPage,
                "page":state.pagination.page,
                "dateFrom": state.dateFrom,
                "dateTo": state.dateTo,
                "associatedWithProjects": state.selectedProjects,
                "associatedWithCompanies": state.selectedCompanies,
                "fromContact": state.fromContact,
                "toContacts": state.toContacts,
                "isUncategorized": state.showUncategorized
            },
            pollInterval: POLL_INTERVAL
        })
        
        this.$queryRegistry.add('QUERY_MESSAGES',observableQuery)

        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('messages',response.data.messages.data)
                commit('total',response.data.messages.total)
                commit('messagesLoading',false)
            },
            error: (error, done) => {

            }
        })

        this.$queryRegistry.addSubscription('QUERY_MESSAGES',subscription)

        // const response = await client.query({
        //     query: QUERY_MESSAGES,
        //     variables: {
        //         "q":state.search,
        //         "sort_by":state.pagination.sortBy,
        //         "sort_desc":state.pagination.descending,
        //         "per_page":state.pagination.rowsPerPage,
        //         "page":state.pagination.page,
        //         "dateFrom": state.dateFrom,
        //         "dateTo": state.dateTo,
        //         "associatedWithProjects": state.selectedProjects,
        //         "associatedWithCompanies": state.selectedCompanies,
        //         "fromContact": state.fromContact,
        //         "toContacts": state.toContacts,
        //         "isUncategorized": state.showUncategorized
        //     },
        //     fetchPolicy: fetchPolicy
        // })
        // .then(function(response) {
        //     commit('messages',response.data.messages.data)
        //     commit('total',response.data.messages.total)
        //     commit('messagesLoading',false)
        // })
        // .catch(function(error){

        // });        
    },
    async fetchCompaniesAndProjects({state,commit,dispatch},options) {
        let fetchPolicy = 'cache-first'
        if(options != null && options.refresh != null) {
            fetchPolicy = options.refresh ? 'network-only' : 'cache-first'
        }
        commit('filtersLoading',true)
        let client = this.app.apolloProvider.defaultClient
        let observableQuery = client.watchQuery({
            query: QUERY_FETCH_COMPANIES_PROJECTS_CONTACTS,
            pollInterval: SLOW_POLL_INTERVAL
        })
        
        this.$queryRegistry.add('QUERY_FETCH_COMPANIES_PROJECTS_CONTACTS',observableQuery)

        let subscription = observableQuery.subscribe({
            next: (response) => {
                commit('companies',response.data.companies.data)
                commit('projects',response.data.projects.data)
                commit('contacts',response.data.contacts.data)
                commit('sortCategories')
                commit('filtersLoading',false)
            },
            error: (error, done) => {

            }
        })
        this.$queryRegistry.addSubscription('QUERY_FETCH_COMPANIES_PROJECTS_CONTACTS',subscription)
        

        // const response = await client.query({
        //     query: QUERY_FETCH_COMPANIES_PROJECTS_CONTACTS,
        //     fetchPolicy: fetchPolicy
        // })
        // .then(function(response) {  
        //     commit('companies',response.data.companies.data)
        //     commit('projects',response.data.projects.data)
        //     commit('contacts',response.data.contacts.data)
        //     commit('sortCategories')
        //     commit('filtersLoading',false)
        // })
        // .catch(function(error){

        // });

    }
}