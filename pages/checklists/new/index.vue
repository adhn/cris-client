<template>
    <checklist-form :title="'Add checklist to project: ...'" />
</template>

<script>
    import ChecklistForm from '~/components/Checklist/ChecklistForm.vue'

    export default {
        components: {ChecklistForm},
        fetch({store,params}) {
            return Promise.all([
                store.commit('checklist/reset'),
                store.commit('checklist/new'),
                store.dispatch('checklist_template_field/fetchChecklistTemplates')
            ])
        } 
    }
</script>