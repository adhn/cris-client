<template>
    <interaction-form />
</template>

<script>
    import InteractionForm from '~/components/Interaction/InteractionForm.vue'

    export default {
        components: {InteractionForm},
        fetch({store,params}) {
            return Promise.all([
                store.commit('interaction/reset'),
                store.dispatch('interaction/edit',params.id),
                store.dispatch('interaction_type_field/fetchInteractionTypes'),
                store.dispatch('company_field/fetchCompanies'),
                store.dispatch('contact_field/fetchContacts'),
                store.dispatch('project_field/fetchProjects'),
                store.dispatch('event_field/fetchEvents'),

            ]).then(function() {


            })

        } 
    }
</script>