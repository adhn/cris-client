import gql from 'graphql-tag';
const omitDeep = require("omit-deep-lodash");
import {mergeWith} from 'lodash';
import { POLL_INTERVAL, NO_POLL } from './constants';

const QUERY_GET_INTERACTION = gql`
query GetInteraction($id:Int!) {
    interaction(id: $id) {
      id
      title
      description
      location
      interactionType {
          id
          name
      }
      contacts {
          id
      }
      projects {
          id
      }
      companies {
          id
      }
      events {
          id
      }
    }
}
`

const MUTATION_SAVE_INTERACTION = gql`
mutation SaveInteraction($interaction:InteractionInputType) {
    CreateUpdateInteraction(InteractionInput:$interaction) {
        id
  	}
}
`
const MUTATION_DELETE_INTERACTION = gql`
mutation DeleteInteractionMutation($id:Int!){
    DeleteInteraction(id:$id)
}
`

export const state = () => ({
    default: {
        id: null,
        interaction_type_id: null,
        title: '',
        description: '',
        location: ''
    },
    interaction: {},
    contacts: [],
    companies: [],
    projects: [],
    events: []

})

export const mutations = {
    clearInteractionBeforeSaving(state) {
        // https://stackoverflow.com/questions/40329742/removing-object-properties-with-lodash
        let interaction = _.pick(state.interaction, _.keys(state.default));

        interaction.companies = state.companies
        interaction.contacts = state.contacts
        interaction.projects = state.projects
        interaction.events = state.events

        state.interaction = Object.assign({},omitDeep(interaction,'__typename'))

    },
    new(state) {
        // https://stackoverflow.com/questions/44033997/how-do-i-merge-two-objects-while-omitting-null-values-with-lodash
        mergeWith(
            state.interaction, state.default, {},
            (a, b) => b === null ? a : undefined
        )

    },
    interaction(state,payload) {
        mergeWith(
            state.interaction, state.default, payload,
            (a, b) => b === null ? a : undefined
        )

        if(payload.companies && payload.companies.length > 0) {
            state.companies = payload.companies.map(function(company) {
                return company.id
            })
        }

        if(payload.contacts && payload.contacts.length > 0) {
            state.contacts = payload.contacts.map(function(contact) {
                return contact.id
            })
        }

        if(payload.projects && payload.projects.length > 0) {
            state.projects = payload.projects.map(function(project) {
                return project.id
            })
        }

        if(payload.events && payload.events.length > 0) {
            state.events = payload.events.map(function(event) {
                return event.id
            })
        }

        // interactionType
        if(state.interaction.interactionType) {
            state.interaction.interaction_type_id = state.interaction.interactionType.id
        }
    },

    reset(state) {
        state.interaction = Object.assign({},state.default)
        state.id = -1
    },

    id(state,payload) { state.interaction.id = payload },
    title(state,payload) { state.interaction.title = payload },
    description(state,payload) { state.interaction.description = payload },
    location(state,payload) { state.interaction.location = payload },
    interaction_type_id(state,payload) { state.interaction.interaction_type_id = payload },
    
    companies(state,payload) { state.companies = payload },
    contacts(state,payload) { state.contacts = payload},
    projects(state,payload) { state.projects = payload},
    events(state,payload) { state.events = payload}

}

export const getters = {
    // total: state => state.total,
    isNew: state => !state.interaction.id ? true: false,
    interaction: state => state.interaction,

    // interaction fields
    id: state => state.interaction.id, 
    interaction_type_id: state => state.interaction.interaction_type_id, 
    title: state => state.interaction.title, 
    description: state => state.interaction.description, 
    location: state => state.interaction.location, 

    companies: state => state.companies,
    contacts: state => state.contacts,
    projects: state => state.projects,
    events: state => state.events

}

export const actions = {
    async deleteInteraction({commit,state,dispatch},interactionId) {
        let client = this.app.apolloProvider.defaultClient
        const response = await client.mutate({
            mutation: MUTATION_DELETE_INTERACTION,
            variables: { id: interactionId }   
        }).then(function(response) {
            dispatch('interaction_list/fetchInteractions',{refresh:true},{root:true})
            dispatch('interaction_list_trashed/fetch',{refresh:true},{root:true})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Interaction deleted succesfully'
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when deleting Interaction: '+error,
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
            query: QUERY_GET_INTERACTION,
            variables: { 
                id: id,
            },
            pollInterval: NO_POLL
        })
        
        // this.$queryRegistry.add('QUERY_GET_INTERACTION',observableQuery)

        observableQuery.subscribe({
            next: (response) => {
                commit('interaction', response.data.interaction);
            },
            error: (error, done) => {

            }
        })
    },

    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        commit('clearInteractionBeforeSaving')
        
        const response = await client.mutate({
            mutation: MUTATION_SAVE_INTERACTION,
            variables: { interaction: state.interaction }   
        }).then(function(response) {
            dispatch('interaction_list/fetchInteractions',{refresh:true},{root:true})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Interaction saved succesfully'
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving Interaction: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    }
}