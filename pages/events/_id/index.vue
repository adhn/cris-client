<template>
<div>
        <event-main-information class="mb-3" />
        <event-details class="mb-3" />
        <event-whiteboard class="mb-3" />
        <event-checklist class="mb-3" />
        <event-interaction class="mb-3" />
        <event-notes class="mb-3" />
        <event-history class="mb-3" />
</div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import EventMainInformation from '~/components/Event/EventMainInformation.vue'
    import EventDetails from '~/components/Event/EventDetails.vue'
    import EventWhiteboard from '~/components/Event/EventWhiteboard.vue'
    import EventChecklist from '~/components/Event/EventChecklist.vue'
    import EventInteraction from '~/components/Event/EventInteraction.vue'
    import EventNotes from '~/components/Event/EventNotes.vue'
    import EventHistory from '~/components/Event/EventHistory.vue'
    

    export default {
        components: {
            EventMainInformation,
            EventDetails,
            EventWhiteboard,
            EventChecklist,
            EventInteraction,
            EventNotes,
            EventHistory
        },
        data: () => ({
        }),
        computed: {
            ...mapGetters('event',['event']),            
        },
        async fetch({ store, params }) {
            // store.commit('contact/reset')
            return Promise.all([
                store.dispatch('event/edit',parseInt(params.id)),
                store.dispatch('event_type_field/fetchEventTypes'),

                store.commit('interaction_list/resetFilters'),     
                store.commit('interaction_list/associatedWithEvents',[parseInt(params.id)]),
                store.dispatch('interaction_list/fetchInteractions'),  

                store.commit('note_list/resetFilters'),     
                store.commit('note_list/belongingToEvent',parseInt(params.id)),
                store.dispatch('note_list/fetchNotes'),    


                store.commit('audit_list/resetFilters'),     
                store.commit('audit_list/auditableType',"App\\Event"),
                store.commit('audit_list/auditableId',parseInt(params.id)),
                store.dispatch('audit_list/fetchAudits'),

                store.commit('audit_checklist_item_list/resetFilters'),     
                store.commit('audit_checklist_item_list/eventId',parseInt(params.id)),
                store.dispatch('audit_checklist_item_list/fetchAudits'),

                store.commit('checklist/reset'),
                store.dispatch('checklist/editByEventId',parseInt(params.id))


            ]).then(function() {


            }); 

        }
    }
</script>