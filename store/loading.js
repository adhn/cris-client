export const state = () => ({
    loading: false,
    color: 'success',
    multiLine: false,
    timeout: 3000,
    vertical: false,
    text: ''
})

export const getters = {
    loading: state => state.loading,
    color: state => state.color,
    multiLine: state => state.multiLine,
    timeout: state => state.timeout,
    vertical: state => state.vertical,
    text: state => state.text

}
export const actions = {}

export const mutations = {
    loading (state,payload) {
        state.loading = payload
    },
}