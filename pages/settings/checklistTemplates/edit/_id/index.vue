<template>
    <checklist-template-form />
</template>

<script>
    import ChecklistTemplateForm from '~/components/ChecklistTemplate/ChecklistTemplateForm.vue'

    export default {
        components: {ChecklistTemplateForm},
        fetch({store,params,redirect}) {
            if (!store.getters['auth/isAdmin']) {
                return redirect('/settings')
            }
            return Promise.all([
                store.commit('checklist_template/new'),
                store.dispatch('checklist_template/edit',parseInt(params.id))

            ])

        } 
    }
</script>
