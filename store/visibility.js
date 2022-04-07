import {POLL_INTERVAL} from './constants'

export const state = () => ({
    visible: false,
})

export const getters = {
    visible: state => state.visible,
    companyListQuery: (state,rootGetters) => rootGetters['company_list/observable']

}
export const actions = {}

export const mutations = {
    visible (state,payload) {
        state.visible = payload

        let client = this.app.apolloProvider.defaultClient
        if(state.visible) {
            // console.info('setting poll interval at: '+POLL_INTERVAL+' ms')
            // POLL_INTERVAL = 5000
            this.$queryRegistry.start()
        } else {
            // console.info('disabling polling globally')
            this.$queryRegistry.stop()

            // POLL_INTERVAL = 0
        }
        
        // console.info('client',client)

    },
}