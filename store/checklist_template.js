import gql from 'graphql-tag';
import {mergeWith} from 'lodash';
const omitDeep = require("omit-deep-lodash");
import {POLL_INTERVAL} from './constants'

const QUERY_GET_CHECKLIST_TEMPLATE = gql`
query CheckListTemplate($id: Int!) {
	checklistTemplate(id:$id) {
    id
    name
    checklistItems {
      id
      name
      status
      due_date
      due_date_tentative
      note
    }
  }
}
`

const MUTATION_SAVE_CHECKLIST_TEMPLATE = gql`
mutation SaveChecklistTemplate($checklistTemplate:ChecklistTemplateInputType) {
    CreateUpdateChecklistTemplate(ChecklistTemplateInput:$checklistTemplate) {
        id
  	}
}
`

export const state = () => ({
    checklistTemplate: {},
    checklistTemplateDefault: {
        id: null,
        name: ''
    },
    checklistItems: [],
    checklistItemDefault: {
        name: '',
        status: 'NOT DONE',
        due_date: null,
        due_date_tentative: false,
        note: '',
        checklist_template_id: null
    }
})

export const mutations = {
    clearBeforeSaving(state) {
        let checklistTemplate = _.pick(state.checklistTemplate, _.keys(state.checklistTemplateDefault));
        state.checklistTemplate = Object.assign({},omitDeep(checklistTemplate,'__typename'))

        state.checklistTemplate.checklistItems = Object.assign({},omitDeep(state.checklistItems,'__typename'))
    },
    new(state) {
        mergeWith(
            state.checklistTemplate, state.checklistTemplateDefault, {},
            (a, b) => b === null ? a : undefined
        )
        mergeWith(
            state.checklistItems, state.checklistItemDefault, {},
            (a, b) => b === null ? a : undefined
        )
    },
    checklistTemplate(state,payload) {
        mergeWith(
            state.checklistTemplate, state.checklistTemplateDefault, payload,
            (a, b) => b === null ? a : undefined
        )
    },
    
    checklistItems(state,payload) {
        // state.checklistItems = payload

        mergeWith(
            state.checklistItems, [], payload,
            (a, b) => b === null ? a : undefined
        )
        // console.info(state.checklistItems)
    },
    reset(state) {
        state.checklistTemplate = Object.assign({},state.checklistTemplateDefault)
    },

    id(state,payload) { state.checklistTemplate.id = payload },
    name(state,payload) { state.checklistTemplate.name = payload },

    addChecklistItem(state) {
        console.info('addChecklistItem state',state)
        state.checklistItems.push(Object.assign({},state.checklistItemDefault))
    },
    
    updateChecklistItem(state,payload) {
        // {id,field,value}

        // Q: is checklistItem returned by reference or by value, A: by reference
        // let checklistItem = state.checklistItems.find(obj => {
        //     return obj.id === payload.id
        // })
        let checklistItem = state.checklistItems.find(obj => {
            return obj === payload.item
        })
        checklistItem[payload.field] = payload.value

    },
    removeItemFromList(state,payload) {
        let checklistItemIndex = state.checklistItems.findIndex(obj => {
            return obj === payload
        })
        state.checklistItems.splice(checklistItemIndex,1)
    }
    
}

export const getters = {
    checklistTemplate: state => state.checklistTemplate,
    id: state => state.checklistTemplate.id,
    name: state => state.checklistTemplate.name, 
 
    checklistItems: state => state.checklistItems, 

    
}

export const actions = {
    async edit({commit},id) {
        let client = this.app.apolloProvider.defaultClient
        commit('reset')
        commit('id',id)
        let observableQuery = client.watchQuery({
            query: QUERY_GET_CHECKLIST_TEMPLATE,
            variables: { 
                id: id,
            },
            pollInterval: POLL_INTERVAL
        })
        
        this,$queryRegistry.add('QUERY_GET_CHECKLIST_TEMPLATE',observableQuery)


        observableQuery.subscribe({
            next: (response) => {
                commit('checklistTemplate', response.data.checklistTemplate);
                commit('checklistItems',[...response.data.checklistTemplate.checklistItems])
            },
            error: (error, done) => {

            }
        })
    },
    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        commit('clearBeforeSaving')
        const response = await client.mutate({
            mutation: MUTATION_SAVE_CHECKLIST_TEMPLATE,
            variables: { 
                checklistTemplate: state.checklistTemplate 
            }   
        }).then(function(response) {
            commit('feedback_snackbar/showSnackbar',{
                text: 'Checklist template saved succesfully'
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving checklist template: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },
}