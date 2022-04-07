import gql from 'graphql-tag';
import {mergeWith} from 'lodash';
import {POLL_INTERVAL, NO_POLL} from './constants'

const omitDeep = require("omit-deep-lodash");

const QUERY_GET_CHECKLIST = gql`
query GetChecklist(
    $id:Int
    $event_id: Int
    ) {
	checklist(
        id:$id
        event_id: $event_id
    ) {
    id
    project_id
    event_id
    name
    status
    created_at
    updated_at
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
}
`

const MUTATION_SAVE_CHECKLIST = gql`
mutation SaveChecklist($checklist:ChecklistInputType) {
    CreateUpdateChecklist(ChecklistInput:$checklist) {
        id
  	}
}
`

const MUTATION_SAVE_CHECKLIST_ITEM = gql`
mutation SaveChecklistItem($checklistItem:ChecklistItemInputType) {
    CreateUpdateChecklistItem(ChecklistItemInput:$checklistItem) {
        id
  	}
}
`

const MUTATION_DELETE_CHECKLIST_ITEM = gql`
mutation DeleteChecklistItemMutation($id:Int!){
    DeleteChecklistItem(id:$id)
}
`

export const state = () => ({
    loading: false,
    default: {
        id: null,
        name: '',
        status: 'ACTIVE',
        checklistItems: [],
        event_id: null,
        project_id: null
    },
    checklistItems: [],
    checklistItemDefault: {
        id: null,
        name: '',
        status: 'NOT DONE',
        due_date: null,
        due_date_tentative: false,
        note: '',
        checklist_template_id: null,
        loading: false
    },
    checklist: {},
    timeouts: [],
    loadingFields: {
        'name': false,
        'status': false
    }
})

export const mutations = {
    timeouts(state,payload) {
        if(state.timeouts[payload.field]) clearTimeout(state.timeouts[payload.field])
        state.timeouts[payload.field] = payload.value
        switch(payload.field) {
            // set custom message according to field?
        }
    },

    clearChecklistBeforeSaving(state) {
        // https://stackoverflow.com/questions/40329742/removing-object-properties-with-lodash
        let checklist = _.pick(state.checklist, _.keys(state.default));
        checklist.checklistItems = state.checklistItems
                
        state.checklist = Object.assign({},omitDeep(checklist,['__typename','loading']))

    },
    new(state) {
        // https://stackoverflow.com/questions/44033997/how-do-i-merge-two-objects-while-omitting-null-values-with-lodash
        mergeWith(
            state.checklist, state.default, {},
            (a, b) => b === null ? a : undefined
        )
        state.checklistItems = []
    },
    checklist(state,payload) {
        mergeWith(
            state.checklist, state.default, payload,
            (a, b) => b === null ? a : undefined
        )

    },
    checklistItems(state,payload) {
        // state.checklistItems = payload

        state.checklistItems = _.map(payload,function(item) {
            let checklistItem =  Object.assign({},omitDeep(item,['__typename']))     
            checklistItem.loading = false
            return checklistItem      
        })

    },

    reset(state) {
        state.checklist = Object.assign({},state.default)
        state.checklistItems = []
        state.timeouts = []
        state.id = -1
    },

    id(state,payload) { state.checklist.id = payload },
    name(state,payload) { state.checklist.name = payload },
    status(state,payload) { state.checklist.status = payload },
    project_id(state,payload) { state.checklist.project_id = payload },
    event_id(state,payload) { state.checklist.event_id = payload },


    addChecklistItem(state,payload) {
        // console.info('addChecklistItem state',state)
        if(payload) {
            state.checklistItems.push(payload)
        } else {
            state.checklistItems.push(Object.assign({},state.checklistItemDefault))
        }
    },


    addChecklistItems(state,payload) {
        if(payload && payload.length > 0) {
            _.map(payload,function(item) {
                let checklistItem =  Object.assign({},omitDeep(item,'__typename'))
                delete checklistItem.id
               
                state.checklistItems.push(checklistItem)
            })
        }
    },
    clearAllChecklistItems(state) {
        state.checklistItems = []
    },



    updateChecklistItem(state,payload) {
        // console.info('updateCheckListItem state.checklistItems before',state.checklistItems)
        // {id,field,value}

        // Q: is checklistItem returned by reference or by value, A: by reference
        // let checklistItem = state.checklistItems.find(obj => {
        //     return obj.id === payload.id
        // })
        let checklistItem = state.checklistItems.find(obj => {
            return obj.id === payload.item.id
        })
        checklistItem[payload.field] = payload.value
        // console.info(checklistItem)
        // console.info('updateCheckListItem state.checklistItems after',state.checklistItems)

    },
    removeItemFromList(state,payload) {
        let checklistItemIndex = state.checklistItems.findIndex(obj => {
            return obj === payload
        })
        console.info('checklistItemIndex',checklistItemIndex)
        state.checklistItems.splice(checklistItemIndex,1)
    },
    loading(state,payload) { state.loading = payload },
    loadingFields(state,payload) { state.loadingFields[payload.field] = payload.value }


}

export const getters = {
    loading: state => state.loading,
    loadingFields: (state) => (field) => {
        return state.loadingFields[field]
    },

    // total: state => state.total,
    isNew: state => !state.checklist.id ? true: false,
    checklist: state => state.checklist,

    // project fields
    id: state => state.checklist.id, 
    name: state => state.checklist.name,
    status: state => state.checklist.status,
    project_id: state => state.checklist.project_id,
    event_id: state => state.checklist.event_id,

    created_at: state => state.checklist.created_at,
    updated_at: state => state.checklist.updated_at,
    // actionDate: (state) => {
    //     if(state.checklist && state.checklist.checklistItems) {
    //         let checklistItems = state.checklist.checklistItems
    //         if(checklistItems.length > 0) {
    //             let sortedChecklistItems = _.orderBy(checklistItems, 'due_date_iso8601', 'asc')
    //             return sortedChecklistItems[sortedChecklistItems.length-1].due_date_iso8601
    //         }
    //     }
    // },
    checklistItems: state => state.checklistItems,
    getChecklistItemById: (state) => (id) => {
        return state.checklistItems.find(checklistItem => checklistItem.id == id)
    },
    getChecklistItem: (state) => (item) => {
        return state.checklistItems.find(checklistItem => checklistItem === item)
    },
    getChecklistItemIndex: (state) => (item) => {
        return state.checklistItems.findIndex(checklistItem => checklistItem === item)
    },

}

export const actions = {
    async edit({commit},id) {
        let client = this.app.apolloProvider.defaultClient
        commit('reset')
        commit('id',id)
        // console.info('checklist_id',id)
        let observableQuery =  client.watchQuery({
            query: QUERY_GET_CHECKLIST,
            variables: { 
                id: id,
            },
            pollInterval: NO_POLL
        })
        
        this.$queryRegistry.add('QUERY_GET_CHECKLIST',observableQuery)

        observableQuery.subscribe({
            next: (response) => {
                commit('checklist', response.data.checklist);
                commit('checklistItems',response.data.checklist.checklistItems)
            },
            error: (error, done) => {

            }
        })
    },

    async editByEventId({commit},eventId) {
        let client = this.app.apolloProvider.defaultClient
        commit('reset')
        let observableQuery = client.watchQuery({
            query: QUERY_GET_CHECKLIST,
            variables: { 
                event_id: eventId,
            },
            pollInterval: NO_POLL
        })
        
        this.$queryRegistry.add('QUERY_GET_CHECKLIST_EVENT_ID',observableQuery)


        observableQuery.subscribe({
            next: (response) => {
                commit('checklist', response.data.checklist);
                commit('checklistItems',response.data.checklist.checklistItems)
            },
            error: (error, done) => {

            }
        })
    },





    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        commit('clearChecklistBeforeSaving')
        
        const response = await client.mutate({
            mutation: MUTATION_SAVE_CHECKLIST,
            variables: { checklist: state.checklist }   
        }).then(function(response) {
            commit('id',response.data.CreateUpdateChecklist.id)
            commit('feedback_snackbar/showSnackbar',{
                text: 'Checklist saved succesfully'
            },{ root: true })
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving Checklist: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },


    async addChecklistItem({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient
        
        let checklistItem = Object.assign({},state.checklistItemDefault)
        delete checklistItem.loading

        if(state.checklist.id) {
            checklistItem.checklist_id = state.checklist.id
        }

        commit('loading',true)
        const response = await client.mutate({
            mutation: MUTATION_SAVE_CHECKLIST_ITEM,
            variables: { checklistItem: checklistItem }   
        }).then(function(response) {
            commit('loading',false)
            // console.info('addChecklistitem response',response)
            checklistItem.id = response.data.CreateUpdateChecklistItem.id
            // console.info('addChecklistitem',checklistItem)
            checklistItem.loading = false
            commit('addChecklistItem',checklistItem)

        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving Checklist item: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },
    async updateChecklistItem({state,commit,dispatch},payload) {

        commit('timeouts',{
            item: payload.item,
            field: payload.field,
            value: null,
            message: 'saving...'
        })


        // payload {item,field,value}
        let client = this.app.apolloProvider.defaultClient
        commit('updateChecklistItem',payload)
        commit('updateChecklistItem',{item:payload.item,field:'loading',value:true})

        let checklistItem = Object.assign({},payload.item)
        delete checklistItem.loading

        const response = await client.mutate({
            mutation: MUTATION_SAVE_CHECKLIST_ITEM,
            variables: { checklistItem: checklistItem }   
        }).then(function(response) {
            commit('updateChecklistItem',{item:payload.item,field:'loading',value:false})
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when updating Checklist item: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },
    async delayedUpdateChecklistItem({state,commit,dispatch},obj) {
        commit('timeouts',{
            item: obj.item,
            field: obj.field,
            value: setTimeout(function() {
                dispatch('updateChecklistItem',obj)
            }, 1000),
            message: 'waiting for you to stop typing...'
        })
    },
    
    async delayedUpdateChecklist({state,commit,dispatch},obj) {
        commit('timeouts',{
            item: 'checklist-'+obj.field,
            field: obj.field,
            value: setTimeout(function() {
                dispatch('updateChecklist',obj)
            }, 1000),
            message: 'waiting for you to stop typing...'
        })
    },
    async updateChecklist({state,commit,dispatch},payload) {

        commit('timeouts',{
            item: 'checklist',
            field: payload.field,
            value: null,
            message: 'saving...'
        })
        // update state value        
        commit(payload.field,payload.value)
        commit('loadingFields',{
            field: payload.field,
            value: true
        })
        // create checklist object only containing the field which is being updated
        let checklist = {
                id: state.checklist.id
        }
        checklist[payload.field] = payload.value

        let client = this.app.apolloProvider.defaultClient
        const response = await client.mutate({
            mutation: MUTATION_SAVE_CHECKLIST,
            variables: { checklist: checklist }   
        }).then(function(response) {
            commit('loadingFields',{
                field: payload.field,
                value: false
            })
            // console.info('autosaved',payload.field)
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when updating Checklist: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },

    async removeItemFromList({state,commit,dispatch,getters},payload) {
        // payload {item}        
        let client = this.app.apolloProvider.defaultClient
        let item = getters['getChecklistItem'](payload)

        console.info('removeItemFromList action payload',payload)
        console.info('removeItemFromList action item',item)
        if(item && item.id) {
            commit('updateChecklistItem',{item:item,field:'loading',value:true})
            const response = await client.mutate({
                mutation: MUTATION_DELETE_CHECKLIST_ITEM,
                variables: { id: item.id }   
            }).then(function(response) {
                commit('updateChecklistItem',{item:item,field:'loading',value:false})
                commit('removeItemFromList',payload)
            }).catch(function(error){
                commit('feedback_snackbar/showSnackbar',{
                    text: 'Error when updating Checklist item: '+error,
                    color: 'error',
                    timeout: 10000
                },{ root: true })
            });    
        }
    }

}