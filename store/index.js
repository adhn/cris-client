export const state = () => ({
    counter: 0,
    csrf: null,
})

export const getters = {
    csrf: state => state.csrf
}
export const mutations = {
    csrf (state,payload) {
        console.info(payload)
        state.csrf = payload
    },
    increment (state) {
        state.counter++
    }
}

export const actions = {
    async fetchCsrf({state,commit}) {
        const resp = await this.$axios.$get('/login/csrf')
        commit('csrf', resp.csrf)
        return resp
    }
}