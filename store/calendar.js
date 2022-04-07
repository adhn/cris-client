const omitDeep = require("omit-deep-lodash");

export const state = () => ({
    dateFrom: null,
    dateTo: null,
    events: {},
    loading: false
})

export const getters = {
    dateFrom: state => state.dateFrom,
    dateTo: state => state.dateTo,
    events: state => state.events,
    loading: state => state.loading
}

export const mutations = {
    dateFrom (state,payload) {
        state.dateFrom = payload
    },
    dateTo (state,payload) {
        state.dateTo = payload
    },
    events(state,payload) {
        state.events = {}
        if(payload) {
            payload.forEach(e => (state.events[e.date] = state.events[e.date] || []).push(Object.assign({open:false},e)))
        }
        console.info('events',state.events)
    },
    loading(state,payload) {
        state.loading = payload
    }
}

export const actions = {
    async fetchCalendarEvents({state,commit,dispatch}) {
        // get personal access tokens
        const calendarEndPoint = '/calendar'
        // console.info('store/calendar fetchCalendarEvents',state.dateFrom,state.dateTo)
        commit('loading',true)
        await this.app.$axios.get(calendarEndPoint,{
            params: {
                dateFrom: state.dateFrom,
                dateTo: state.dateTo
            }
        })
        .then(response => {
            commit('events',response.data)
            commit('loading',false)
        });   
    }
}

