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
                // store.dispatch('interaction/edit',params.id),
                store.dispatch('interaction_type_field/fetchInteractionTypes'),
            ]).then(function() {


            })

        } 
    }
</script>