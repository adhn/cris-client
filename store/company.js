import gql from 'graphql-tag';
import {mergeWith} from 'lodash';

import {POLL_INTERVAL, NO_POLL} from './constants'


const omitDeep = require("omit-deep-lodash");

const QUERY_GET_COMPANY = gql`
query GetCompany($company_id:Int!) {
    company(id:$company_id) {
      id
      name
      is_client
      status
      company_address
      onedrive_folder_location
      primaryContact {
          id,display_name
      }
      billingContact {
          id,display_name
      }

      whiteboard_1
	  whiteboard_2
      whiteboard_3
    }  
} 
`

const MUTATION_SAVE_COMPANY = gql`
mutation SaveCompany($company:CompanyInputType) {
    CreateUpdateCompany(CompanyInput:$company) {
        id
        name
        is_client
        status
        company_address
        onedrive_folder_location
        primaryContact {
            id,display_name
        }
        billingContact {
            id,display_name
        }
        whiteboard_1
        whiteboard_2
        whiteboard_3
  	}
}
`

/**
 * @return Boolean
 */
const MUTATION_DELETE_COMPANY = gql`
mutation DeleteCompanyMutation($id:Int!){
    DeleteCompany(id:$id)
}
`

/**
 * @return Contact
 */
const MUTATION_ASSOCIATE_COMPANY_AND_CONTACT = gql `
mutation AssociateCompanyWithContact(
    $company_id:Int!
    $contact_id:Int!
) {
    AssociateCompanyWithContact(
        company_id:$company_id
        contact_id: $contact_id
    ) {
    id
  	}
}
`
/**
 * @return Project
 */
const MUTATION_ASSOCIATE_COMPANY_AND_PROJECT = gql `
mutation AssociateCompanyWithProject(
    $company_id:Int!
    $project_id:Int!
    $project_role_id:Int!
) {
    AssociateCompanyWithProject(
        company_id:$company_id
        project_id: $project_id
        project_role_id: $project_role_id
    ) {
    id
  	}
}
`
/**
 * @return Interaction
 */
const MUTATION_ASSOCIATE_COMPANY_AND_INTERACTION = gql `
mutation AssociateCompanyWithInteraction(
    $company_id:Int!
    $interaction_id:Int!
) {
    AssociateCompanyWithInteraction(
        company_id:$company_id
        interaction_id: $interaction_id
    ) {
        id
  	}
}
`




export const state = () => ({
    default: {
        id: null,
        name: '',
        is_client: true,
        status: 'ACTIVE',
        company_address: '',
        primary_contact_id: '',
        billing_contact_id: '',
        whiteboard_1: '',
        whiteboard_2: '',
        whiteboard_3: '',
        onedrive_folder_location: ''
    },
    company: {},
    timeouts: [],
    whiteboard_1_message: '',
    whiteboard_2_message: '',
    whiteboard_3_message: ''
})

export const getters = {
    isNew: state => !state.company.id ? true: false,
    company: state => state.company,
    // company fields
    id: state => state.company.id, 
    name: state => state.company.name, 
    is_client: state => state.company.is_client, 
    status: state => state.company.status, 
    company_address: state => state.company.company_address, 
    primary_contact_id: state => state.company.primary_contact_id, 
    billing_contact_id: state => state.company.billing_contact_id, 
    whiteboard_1: state => state.company.whiteboard_1, 
    whiteboard_2: state => state.company.whiteboard_2, 
    whiteboard_3: state => state.company.whiteboard_3, 
    onedrive_folder_location: state => {
        if(state.company.onedrive_folder_location && typeof state.company.onedrive_folder_location === 'string') {
            return JSON.parse(state.company.onedrive_folder_location)
        } else {
            return state.company.onedrive_folder_location
        }
    },
    timeouts: state => state.timeouts,
    whiteboard_1_message: state => state.whiteboard_1_message,
    whiteboard_2_message: state => state.whiteboard_2_message,
    whiteboard_3_message: state => state.whiteboard_3_message
}

export const mutations = {
    timeouts(state,payload) {
        if(state.timeouts[payload.field]) clearTimeout(state.timeouts[payload.field])
        state.timeouts[payload.field] = payload.value
        switch(payload.field) {
            case 'whiteboard_1':
                state.whiteboard_1_message = payload.message
                break
            case 'whiteboard_2':
                state.whiteboard_2_message = payload.message
                break
            case 'whiteboard_3':
                state.whiteboard_3_message = payload.message
                break
        }
    },
    clearCompanyBeforeSaving(state) {
        // https://stackoverflow.com/questions/40329742/removing-object-properties-with-lodash
        let company = _.pick(state.company, _.keys(state.default));
        state.company = Object.assign({},omitDeep(company,'__typename'))
        state.company.onedrive_folder_location = JSON.stringify(state.company.onedrive_folder_location)
    },
    newCompany(state) {
        // https://stackoverflow.com/questions/44033997/how-do-i-merge-two-objects-while-omitting-null-values-with-lodash
        mergeWith(
            state.company, state.default, {},
            (a, b) => b === null ? a : undefined
        )
    },
    company(state,payload) {
        mergeWith(
            state.company, state.default, payload.company,
            (a, b) => b === null ? a : undefined
        )
        
        // primaryContact
        if(state.company.primaryContact) {
            state.company.primary_contact_id = state.company.primaryContact.id
        }

        // billingContact
        if(state.company.billingContact) {
            state.company.billing_contact_id = state.company.billingContact.id
        }

    },
    reset(state) {
        state.company = Object.assign({},state.default)
        state.id = -1
    },
    id(state,payload) { state.company.id = payload },
    name(state,payload) { state.company.name = payload },
    is_client(state,payload) { state.company.is_client = payload },
    status(state,payload) { state.company.status = payload },
    company_address(state,payload) { state.company.company_address = payload },
    primary_contact_id(state,payload) { state.company.primary_contact_id = payload },
    billing_contact_id(state,payload) { state.company.billing_contact_id = payload },
    whiteboard_1(state,payload) { state.company.whiteboard_1 = payload },
    whiteboard_2(state,payload) { state.company.whiteboard_2 = payload },
    whiteboard_3(state,payload) { state.company.whiteboard_3 = payload },
    onedrive_folder_location(state,payload) { state.company.onedrive_folder_location = payload },

}

export const actions = {

    async deleteCompany({commit,state,dispatch},companyId) {
        let client = this.app.apolloProvider.defaultClient
        const response = await client.mutate({
            mutation: MUTATION_DELETE_COMPANY,
            variables: { id: companyId }   
        }).then(function(response) {
            dispatch('company_list/fetchCompanies',{refresh:true},{root:true})
            dispatch('company_list_trashed/fetch',{refresh:true},{root:true})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Company deleted succesfully'
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when deleting Company: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });       
    },

    async edit({commit},id) {
        let client = this.app.apolloProvider.defaultClient
        commit('reset')
        commit('id',id)
        let observableQuery = client.watchQuery({
            query: QUERY_GET_COMPANY,
            variables: { 
                company_id: id,
            },
            pollInterval: NO_POLL
        })
        
        this.$queryRegistry.add('QUERY_GET_COMPANY',observableQuery)
        
        observableQuery.subscribe({
            next: (response) => {
                commit('company', {company:response.data.company});
            },
            error: (error, done) => {

            }
        })

        // const response = await client.query({
        //     query: QUERY_GET_COMPANY,
        //     variables: { 
        //         company_id: id,
        //     },
        // }).then(function(response) {
        //     commit('company', {company:response.data.company});
        // });
    },

    async saveAndAssociateProject({state,commit,dispatch}) {
        dispatch('save').then(function(response) {
            //
        })
    },

    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        commit('clearCompanyBeforeSaving')
        return await client.mutate({
            mutation: MUTATION_SAVE_COMPANY,
            variables: { company: state.company }   
        }).then(function(response) {

            if(state.company.id == null) {
                // supposedly a new company has been created, refresh
                dispatch('company_list/fetchCompanies',{refresh:true},{root:true})
                // dispatch('company_list_trashed/fetch',{refresh:true},{root:true})
            } else {
                dispatch('audit_list/fetchAudits',{refresh:true},{root:true})
            }

            // commit('contactLoading',false)
            // trigger the setContact mutation
            // commit('setContact', {contact:response.data.contact})
            commit('id',response.data.CreateUpdateCompany.id)
            // console.info('company save response state.company.id',state.company.id)
            commit('feedback_snackbar/showSnackbar',{
                text: 'Company saved succesfully'
            },{ root: true })
            // return dispatch('contact_list/fetchData',null,{root:true})
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving company: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

    async associateContact({state,commit,dispatch},contact_id) {
        let client = this.app.apolloProvider.defaultClient
        return await client.mutate({
            mutation: MUTATION_ASSOCIATE_COMPANY_AND_CONTACT,
            variables: { company_id: state.company.id,contact_id: contact_id }   
        }).then(function(response) {
            dispatch('audit_pivot_list/fetchAuditPivots',{refresh:true},{root:true})
            dispatch('contact_list/fetchContactsFromGraphQL',{refresh:true},{root:true})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Contact succesfully attached to '+state.company.name
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when attaching contact to company: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

    async associateProject({state,commit,dispatch},projectInfo) {
        let client = this.app.apolloProvider.defaultClient
        return await client.mutate({
            mutation: MUTATION_ASSOCIATE_COMPANY_AND_PROJECT,
            variables: { 
                company_id: state.company.id,
                project_id: projectInfo.project_id,
                project_role_id: projectInfo.project_role_id
            }   
        }).then(function(response) {
            dispatch('audit_pivot_list/fetchAuditPivots',{refresh:true},{root:true})
            dispatch('project_list/fetchProjects',{refresh:true},{root:true})

            commit('feedback_snackbar/showSnackbar',{
                text: 'Project succesfully attached to '+state.company.name
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when attaching project to company: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

    async associateInteraction({state,commit,dispatch},interactionId) {
        let client = this.app.apolloProvider.defaultClient
        return await client.mutate({
            mutation: MUTATION_ASSOCIATE_COMPANY_AND_INTERACTION,
            variables: { 
                company_id: state.company.id,
                interaction_id: interactionId,
            }   
        }).then(function(response) {
            dispatch('audit_pivot_list/fetchAuditPivots',{refresh:true},{root:true})
            dispatch('interaction_list/fetchInteractions',{refresh:true},{root:true})

            commit('feedback_snackbar/showSnackbar',{
                text: 'Interaction succesfully attached to '+state.company.name
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when attaching Interaction to company: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },



    async delayed_whiteboard_autosave({state,commit,dispatch},obj) {
        commit(obj.field,obj.value)
        commit('timeouts',{
            field: obj.field,
            value: setTimeout(function() {
                dispatch('autosave',obj.field)
            }, 1000),
            message: 'waiting for you to stop typing...'
        })
    },

    async autosave({state,commit,dispatch},field) {
        commit('timeouts',{
            field: field,
            value: null,
            message: 'saving...'
        })

        let client = this.app.apolloProvider.defaultClient

        let partialCompany = {
            id: state.company.id
        }
        partialCompany[field] = state.company[field]


        const response = await client.mutate({
            mutation: MUTATION_SAVE_COMPANY,
            variables: {
                company: partialCompany
            }   
        }).then(function(response) {
            commit('timeouts',{
                field: field,
                value: null,
                message: 'saved!'
            })
        }).catch(function(error){

        });    
    },
}