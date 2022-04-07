<template>
    <company-form />
</template>

<script>
    import CompanyForm from '~/components/Company/CompanyForm.vue'

    export default {
        components: {CompanyForm},
        fetch({store,params,redirect}) {

            return Promise.all([
                store.commit('company/reset'),
                store.dispatch('company/edit',params.id),
                store.dispatch('contact_field/fetchContacts'),

            ]).then(function() {
            
                if(store.getters['company/status'] == 'ARCHIVED' && !store.getters['auth/isAdmin']) {
                    redirect('/companies/'+params.id)
                }

            })

        } 
    }
</script>