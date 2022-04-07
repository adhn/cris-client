<template>
    <checklist-form :title="'Edit checklist: '+name" />
</template>

<script>
    import ChecklistForm from '~/components/Checklist/ChecklistForm.vue'
    import {mapGetters} from 'vuex';

    export default {
        components: {ChecklistForm},
        fetch({store,params}) {
            return Promise.all([
                store.commit('checklist/reset'),
                store.dispatch('checklist/edit',parseInt(params.id)),
                store.dispatch('checklist_template_field/fetchChecklistTemplates'),
                store.dispatch('project_field/fetchProjects')

            ])
        },
        computed: {
            ...mapGetters('checklist',['id','name']),
        }
    }
</script>