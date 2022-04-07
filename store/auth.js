import gql from 'graphql-tag';
const QUERY_AUTHENTICATED_USER = gql`
query AuthenticatedUser {
    authenticatedUser {
      id
      name
      email
      graph_avatar
      graph_id
      graph_account_enabled
    }
  }
`
export const state = () => ({
    user: null,
    tokenInfo: {},
    accessToken: null,
    isAdmin: false
})

export const getters = {
    user: state => state.user,
    // tokenInfo: state => state.tokenInfo,
    accessToken: state => state.accessToken,
    isAdmin: state => state.isAdmin,
}

export const mutations = {
    user (state,payload) {
        state.user = payload
    }, 
    // tokenInfo(state,payload) { 
    //     state.tokenInfo = payload
    // },
    accessToken(state,payload) {
        state.accessToken = payload
    },
    isAdmin(state,payload) {
        state.isAdmin = payload
    }
}
export const actions = {
    async fetchAuthenticatedUser({state,commit}) {
        if(!state.user) {
            // get personal access tokens
            const authenticatedUserEndpoint = '/authenticated-user'
            await this.app.$axios.get(authenticatedUserEndpoint)
            .then(response => {
                commit('user',response.data)
                commit('accessToken',response.data.personal_access_token)
                commit('isAdmin',response.data.is_admin)
                // console.info('authenticated-user-response',response.data)
                this.app.$axios.setToken(response.data.personal_access_token,'Bearer')
            });
        }   
    },

    // async fetchAuthenticatedUser({state,commit}) {
    //     let client = this.app.apolloProvider.defaultClient
    //     const response = await client.query({
    //     query: QUERY_AUTHENTICATED_USER,
    //     }).then(function(response) {
    //         commit('user',response.data.authenticatedUser)
    //     }).catch(function(response) {

    //     })
    // },
}
