<template>
    <project-form />
</template>

<script>
    import ProjectForm from '~/components/Project/ProjectForm.vue'

    export default {
        components: {ProjectForm},
        fetch({store,params}) {
            return Promise.all([
                store.commit('project/reset'),
                store.dispatch('project/edit',params.id),
                store.dispatch('project_type_field/fetchProjectTypes'),
                store.dispatch('country_field/fetchCountries'),
                store.dispatch('company_field/fetchCompanies'),
                store.dispatch('currency_field/fetchCurrencies'),
                store.dispatch('settlement_option_field/fetchSettlementOptions'),
                // store.dispatch('auth/fetchAuthenticatedUser'),

            ])

        } 
    }
</script>