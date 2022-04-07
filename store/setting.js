import gql from 'graphql-tag';
const omitDeep = require("omit-deep-lodash");


const QUERY_GET_ONE_DRIVE_ROOT_SETTING = gql`
query GetOneDriveRootSetting {
    oneDriveRootSetting {
      id
      key
      value
    }  
}
`



const MUTATION_SAVE_ONE_DRIVE_ROOT_SETTING = gql`
mutation SaveOneDriveRootSetting($setting:SettingInputType) {
    oneDriveRootSetting(SettingInput:$setting) {
        key
        value
  	}
}
`

export const state = () => ({
    id: null,
    key: 'one-drive-root',
    value: null,
    usersLoading: false
})

export const mutations = {
    value(state,payload) { state.value = JSON.stringify(payload) },
    usersLoading(state,payload) { state.usersLoading = payload },
}

export const getters = {
    id: state => state.id, 
    key: state => state.key,
    usersLoading: state => state.usersLoading,
    value: state => {
        if(state.value) {
            
            let valueTemp = JSON.parse(state.value)
        
            if(valueTemp && valueTemp.webUrl) {
                return valueTemp
            } else {
                let jsonTemp = JSON.parse(valueTemp)
                if(Array.isArray(jsonTemp)) {
                    if(jsonTemp.length > 0) {
                        return JSON.parse(jsonTemp.pop())
                    } else {
                        return jsonTemp[0]
                    }
                }
                // valueTemp.pop()
            }
            // let arr = JSON.parse(JSON.parse(state.value))
            // let value = JSON.parse(arr.pop())
            // return value
        } else {
            return state.value
        }
    } 
}

export const actions = {
    async edit({commit}) {
        let client = this.app.apolloProvider.defaultClient
        const response = await client.query({
            query: QUERY_GET_ONE_DRIVE_ROOT_SETTING,
        }).then(function(response) {
            // commit('id',response.data.setting.id)
            // commit('key',response.data.setting.key)
            commit('value',response.data.oneDriveRootSetting.value)
        });
    },
    async value({state,commit,dispatch},value) {
        commit('value',value)
        return dispatch('save')
    },
    async save({state,commit,dispatch}) {
        let client = this.app.apolloProvider.defaultClient

        // removeProps(state.contact,['__typename']);
        return await client.mutate({
            mutation: MUTATION_SAVE_ONE_DRIVE_ROOT_SETTING,
            variables: { setting: {
                key: state.key,
                value: state.value
            }}   
        }).then(function(response) {
            // commit('contactLoading',false)
            // trigger the setContact mutation
            // commit('setContact', {contact:response.data.contact})
            commit('feedback_snackbar/showSnackbar',{
                text: 'Setting saved succesfully'
            },{ root: true })
            // return dispatch('contact_list/fetchData',null,{root:true})
        }).catch(function(error){
            commit('feedback_snackbar/showSnackbar',{
                text: 'Error when saving Setting: '+error,
                color: 'error',
                timeout: 10000
            },{ root: true })
        });    
    },
    async refreshUsers({state,commit,dispatch}) {
        commit('usersLoading',true)
        const refreshUsersEndpoint = '/refresh-users'
        await this.app.$axios.get(refreshUsersEndpoint).then(response => {
            console.info('refreshUsers',response)
            commit('usersLoading',false)
        });
    }

}