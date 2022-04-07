export const state = () => ({
    snackbar: false,
    color: 'success',
    multiLine: false,
    timeout: 3000,
    vertical: false,
    text: ''
})

export const getters = {
    snackbar: state => state.snackbar,
    color: state => state.color,
    multiLine: state => state.multiLine,
    timeout: state => state.timeout,
    vertical: state => state.vertical,
    text: state => state.text

}
export const actions = {}

export const mutations = {
    snackbar (state,payload) {
        state.snackbar = payload
    },
    showSnackbar(state,payload) {
        console.info('showSnackbar',payload)
        state.color = payload.color ? payload.color: 'success',
        state.multiLine = payload.multiLine ? payload.multiLine: false,
        state.timeout = payload.timeout ? payload.timeout : 3000,
        state.vertical = payload.vertical ? payload.vertical : false,
        state.text = payload.text
        state.snackbar = true
    }
}