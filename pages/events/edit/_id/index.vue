<template>
    <event-form />
</template>

<script>
    import EventForm from '~/components/Event/EventForm.vue'

    export default {
        components: {EventForm},
        fetch({store,params}) {
            return Promise.all([
                store.commit('event/reset'),
                store.dispatch('event/edit',params.id),
                store.dispatch('event_type_field/fetchEventTypes'),
                store.dispatch('project_field/fetchProjects'),
            ]).then(function() {
                store.commit('checklist/reset'),
                // store.dispatch('checklist/edit',store.getters['event/checklist_id'])
                store.dispatch('checklist/editByEventId',parseInt(params.id))


            })

        } 
    }
</script>