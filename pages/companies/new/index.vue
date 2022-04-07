<template>
    <company-form />
</template>

<script>
    import CompanyForm from '~/components/Company/CompanyForm.vue'

    export default {
        components: {CompanyForm},
        fetch({store,params}) {
            return Promise.all([
                store.commit('company/reset'),
                store.dispatch('contact_field/fetchContacts'),

            ])
        }
    }
</script>