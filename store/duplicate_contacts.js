export const state = () => ({
    duplicateContacts: [],
    count: 0,
    fetched: false,
    currentlyMergingContactId: null
})

export const getters = {
    count: state => state.count,
    duplicateContacts: state => state.duplicateContacts,
    // getDuplicatesByContactId: function(state,contactId) {
    //     let obj = state.duplicate_contacts.find(function(o,contactId) {
    //         console.info(o);
    //         return o.contact.id === contactId
    //     });
    //     // console.info(obj.duplicates)
    //     // this.duplicates = obj.duplicates
    // },
    // currentDuplicates: state => state.duplicate_contacts[state.currentlyMergingContactId]
}

export const actions = {
    async fetch({state,commit}) {
            if(!state.fetched) { 
                let url = process.env.appUrl+'/api/contacts/duplicates/'+state.currentlyMergingContactId
                const response = await this.app.$axios.$get(url)
                commit('fetched',true)
                commit('duplicateContacts', response)
            } 
            
    },
    async deleteCurrentDuplicates({state,commit}) {
        let url = process.env.appUrl+'/api/contacts/delete-duplicates/'+state.currentlyMergingContactId
        
        let mergedContacts = state.duplicateContacts.map(contact => contact.id)
        const response = await this.app.$axios.$post(url,{'mergedContacts': mergedContacts})
    },
}

export const mutations = {
    duplicateContacts(state,payload) {
        if(payload.length > 2) {
            state.duplicateContacts = [payload[0],payload[1]]
        } else {
            state.duplicateContacts = payload
        }
    },
    fetched(state,payload) {
        state.fetched = payload
    },
    currentlyMergingContactId(state,payload) {
        state.currentlyMergingContactId = payload
    }
}