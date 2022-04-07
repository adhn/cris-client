import gql from 'graphql-tag';
const omitDeep = require("omit-deep-lodash");
import {mergeWith} from 'lodash';
import { POLL_INTERVAL, NO_POLL } from './constants';

const QUERY_GET_EVENT = gql`
query GetEvent($id:Int!) {
    event(id: $id) {
      id
      name
      status
      whiteboard_1
      whiteboard_2
      whiteboard_3
      details
      onedrive_folder_location
      eventType {
        id
        name
        key
      }
      project {
        id
        name
        issuerCompany {
            id
            name
        }
      }
      checklist {
          id
          name
          checklistItems {
              id
              name
              status
              due_date
              due_date_iso8601
              due_date_tentative
              note
          }
      }
      created_at
    }
}
`

const MUTATION_SAVE_EVENT = gql`
mutation SaveEvent($event:EventInputType) {
    CreateUpdateEvent(EventInput:$event) {
        id
  	}
}
`

const MUTATION_DELETE_EVENT = gql`
mutation DeleteEventMutation($id:Int!){
    DeleteEvent(id:$id)
}
`

const MUTATION_ASSOCIATE_EVENT_AND_INTERACTION = gql `
mutation AssociateEventWithInteraction(
    $event_id:Int!
    $interaction_id:Int!
) {
    AssociateEventWithInteraction(
        event_id:$event_id
        interaction_id: $interaction_id
    ) {
        id
  	}
}
`


export const state = () => ({
    default: {
        id: null,
        event_type_id: null,
        project_id: null,
        // checklist_id: null,
        checklist_template_id: null,
        status: 'ACTIVE',
        name: '',
        whiteboard_1: '',
        whiteboard_2: '',
        whiteboard_3: '',
        details: '',
        onedrive_folder_location: ''
    },
    event: {},

    timeouts: [],
    whiteboard_1_message: '',
    whiteboard_2_message: '',
    whiteboard_3_message: '',
    // details: ''
})

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
    clearEventBeforeSaving(state) {
        // https://stackoverflow.com/questions/40329742/removing-object-properties-with-lodash
        let event = _.pick(state.event, _.keys(state.default));
        if(event.id) {
            delete event.checklist_template_id
        }
        delete event.action_date
        state.event = Object.assign({},omitDeep(event,'__typename'))
        state.event.onedrive_folder_location = JSON.stringify(state.event.onedrive_folder_location)

    },
    new(state) {
        // https://stackoverflow.com/questions/44033997/how-do-i-merge-two-objects-while-omitting-null-values-with-lodash
        mergeWith(
            state.event, state.default, {},
            (a, b) => b === null ? a : undefined
        )
    },
    event(state,payload) {
        mergeWith(
            state.event, state.default, payload,
            (a, b) => b === null ? a : undefined
        )

        // eventType
        if(state.event.eventType) {
            state.event.event_type_id = state.event.eventType.id
        }

        if(state.event.project) {
            state.event.project_id = state.event.project.id
        }

        if(state.event.checklist) {
            // state.event.checklist_id = state.event.checklist.id
        }

    },

    reset(state) {
        state.event = Object.assign({},state.default)
        state.id = -1
    },


    id(state,payload) { state.event.id = payload },
    name(state,payload) { state.event.name = payload },
    event_type_id(state,payload) { state.event.event_type_id = payload },
    project_id(state,payload) { state.event.project_id = payload },
    // checklist_id(state,payload) { state.event.checklist_id = payload },
    status(state,payload) { state.event.status = payload },
    whiteboard_1(state,payload) { state.event.whiteboard_1 = payload },
    whiteboard_2(state,payload) { state.event.whiteboard_2 = payload },
    whiteboard_3(state,payload) { state.event.whiteboard_3 = payload },
    onedrive_folder_location(state,payload) { state.event.onedrive_folder_location = payload },

    details(state,payload) { state.event.details = payload },

    checklist_template_id(state,payload) { state.event.checklist_template_id = payload },

 
}

export const getters = {
    // total: state => state.total,
    isNew: state => !state.event.id ? true: false,
    event: state => state.event,

    // project fields
    id: state => state.event.id, 
    name: state => state.event.name,

    event_type_id: state => state.event.event_type_id,
    project_id: state => state.event.project_id,
    // checklist_id: state => state.event.checklist_id,
    status: state => state.event.status,

    whiteboard_1: state => state.event.whiteboard_1,
    whiteboard_2: state => state.event.whiteboard_2,
    whiteboard_3: state => state.event.whiteboard_3,
    details: state => state.event.details,

    timeouts: state => state.timeouts,
    whiteboard_1_message: state => state.whiteboard_1_message,
    whiteboard_2_message: state => state.whiteboard_2_message,
    whiteboard_3_message: state => state.whiteboard_3_message,
    onedrive_folder_location: state => {
        if(state.event.onedrive_folder_location && typeof state.event.onedrive_folder_location === 'string') {
            return JSON.parse(state.event.onedrive_folder_location)
        } else {
            return state.event.onedrive_folder_location
        }
    },
    checklist_template_id: state => state.event.checklist_template_id,
    created_at: state => state.event.created_at,

    actionDate: (state) => {
        if(state.event && state.event.checklist && state.event.checklist.checklistItems) {
            let checklistItems = state.event.checklist.checklistItems
            if(checklistItems.length > 0) {
                let sortedChecklistItems = _.orderBy(checklistItems, 'due_date_iso8601', 'asc')
                return sortedChecklistItems[sortedChecklistItems.length-1].due_date_iso8601
            }
        }
    }

}

export const actions = {

    async deleteEvent({commit,state,dispatch},eventId) {
        let client = this.app.apolloProvider.defaultClient
        const response = await client.mutate({
            mutation: MUTATION_DELETE_EVENT,
            variables: { id: eventId }   
        }).then(function(response) {

            dispatch('event_list/fetchEvents',{refresh:true},{root:true})
            dispatch('event_list_trashed/fetch',{refresh:true},{root:true})

            commit('feedback_snackbar/showSnackbar',{
                text: 'Event deleted succesfully'
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when deleting Event: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });       
    },

    async edit({commit},id) {
        let client = this.app.apolloProvider.defaultClient
        commit('reset')
        commit('id',id)
        let observableQuery =  client.watchQuery({
            query: QUERY_GET_EVENT,
            variables: { 
                id: id,
            },
            pollInterval: NO_POLL
        })
        
        // this.$queryRegistry.add('QUERY_GET_EVENT',observableQuery)

        observableQuery.subscribe({
            next: (response) => {
                commit('event', response.data.event);
            },
            error: (error, done) => {

            }
        })
    },

    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        commit('clearEventBeforeSaving')
        
        const response = await client.mutate({
            mutation: MUTATION_SAVE_EVENT,
            variables: { event: state.event }   
        }).then(function(response) {

            dispatch('event_list/fetchEvents',{refresh:true},{root:true})

            commit('feedback_snackbar/showSnackbar',{
                text: 'Event saved succesfully'
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving Event: '+error,
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

        let partial = {
            id: state.event.id
        }
        partial[field] = state.event[field]


        const response = await client.mutate({
            mutation: MUTATION_SAVE_EVENT,
            variables: {
                event: partial
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


    async associateInteraction({state,commit,dispatch},interactionId) {
        let client = this.app.apolloProvider.defaultClient
        return await client.mutate({
            mutation: MUTATION_ASSOCIATE_EVENT_AND_INTERACTION,
            variables: { 
                event_id: state.event.id,
                interaction_id: interactionId,
            }   
        }).then(function(response) {
            dispatch('interaction_list/fetchInteractions',{refresh:true},{root:true})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Interaction succesfully attached to '+state.event.name
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when attaching Interaction to event: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },
}