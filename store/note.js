import gql from 'graphql-tag';
import {mergeWith} from 'lodash';

import {POLL_INTERVAL, NO_POLL} from './constants'

const omitDeep = require("omit-deep-lodash");

const QUERY_GET_NOTE = gql`
query GetNote($note_id:Int!) {
    note(id:$note_id) {
      id
      note
      user {
          id,name
      },
      created_at
    }  
} 
`

const MUTATION_SAVE_NOTE = gql`
mutation SaveNote($note:NoteInputType) {
    CreateUpdateNote(NoteInput:$note) {
        id
        note
        user {
            id,name
        },
        created_at
  	}
}
`

export const state = () => ({
    default: {
        id: null,
        note: '',
        // user_id: null,
        company_id: null,
        project_id: null,
        event_id: null
    },

    note: {},
    readonly: false,
})

export const mutations = {
    clearNoteBeforeSaving(state) {
        console.info(state.note)

        // https://stackoverflow.com/questions/40329742/removing-object-properties-with-lodash
        let note = _.pick(state.note, _.keys(state.default));
        state.note = Object.assign({},omitDeep(note,'__typename'))
        


    },
    newNote(state) {
        // https://stackoverflow.com/questions/44033997/how-do-i-merge-two-objects-while-omitting-null-values-with-lodash
        mergeWith(
            state.note, state.default, {},
            (a, b) => b === null ? a : undefined
        )
    },
    note(state,payload) {
        mergeWith(
            state.note, state.default, payload.note,
            (a, b) => b === null ? a : undefined
        )

        // company
        if(state.note.company) {
            state.note.company_id = state.note.company.id
        }
        // project
        if(state.note.project) {
            state.note.project_id = state.note.project.id
        }
        // event
        if(state.note.event) {
            state.note.event_id = state.note.event.id
        }
        // user
        if(state.note.user) {
            state.note.user_id = state.note.user.id
        }
    },
    reset(state) {
        state.note = Object.assign({},state.default)
        state.id = -1
    },
    id(state,payload) { state.note.id = payload },
    note(state,payload) { state.note.note = payload },
    user_id(state,payload) { state.note.user_id = payload },
    company_id(state,payload) { state.note.company_id = payload },
    project_id(state,payload) { state.note.project_id = payload },
    event_id(state,payload) { state.note.event_id = payload },
}

export const getters = {
    // total: state => state.total,
    isNew: state => !state.note.id ? true: false,
    readonly: state => state.readonly,
    note: state => state.note,
    // project fields
    id: state => state.note.id, 
    note: state => state.note.note, 
    user_id: state => state.note.user_id, 
    company_id: state => state.note.company_id, 
    project_id: state => state.note.project_id, 
    event_id: state => state.note.event_id, 
}

export const actions = {
    async edit({commit},id) {
        let client = this.app.apolloProvider.defaultClient
        commit('reset')
        commit('id',id)
        let observableQuery = client.watchQuery({
            query: QUERY_GET_NOTE,
            variables: { 
                note_id: id,
            },
            pollInterval: NO_POLL
        })
        
        // this.$queryRegistry.add('QUERY_GET_NOTE',observableQuery)
        
        observableQuery.subscribe({
            next: (response) => {
                commit('note', {note:response.data.note});
            },
            error: (error, done) => {

            }
        })
        
    },
    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        // commit('contactLoading',true)
        commit('clearNoteBeforeSaving')

        // removeProps(state.contact,['__typename']);
        const response = await client.mutate({
            mutation: MUTATION_SAVE_NOTE,
            variables: { note: state.note }
        }).then(function(response) {
            // commit('contactLoading',false)
            // trigger the setContact mutation
            // commit('setContact', {contact:response.data.contact})
            dispatch('note_list/fetchNotes', {refresh:true}, {root:true})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Note saved succesfully'
            },{ root: true })
            // return dispatch('contact_list/fetchData',null,{root:true})
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving Note: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

}