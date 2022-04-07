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
                store.commit('event/new'),
                store.dispatch('event_type_field/fetchEventTypes'),
                store.dispatch('project_field/fetchProjects'),
                store.dispatch('checklist_template_field/fetchChecklistTemplates'),


            ])

        } 
    }
</script>