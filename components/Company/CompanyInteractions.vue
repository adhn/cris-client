<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Interactions</h3>


                            <v-spacer />
                            <v-btn flat :to="{ name: 'interactions'}"><v-icon>open_in_new</v-icon></v-btn>
                            <company-interactions-attach-dialog />
                            <company-interactions-new-dialog />
                    </v-card-title>
                    <v-card-text>
                        <interaction-list />
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>

<script>
    import {mapGetters} from 'vuex';
    import InteractionList from '~/components/InteractionList/InteractionList.vue'
    import CompanyInteractionsAttachDialog from '~/components/Company/CompanyInteractionsAttachDialog.vue'
    import CompanyInteractionsNewDialog from '~/components/Company/CompanyInteractionsNewDialog.vue'

    export default {
        props: [],
        components: {
            InteractionList,
            CompanyInteractionsAttachDialog,
            CompanyInteractionsNewDialog
        },
        data: () => ({

        }),
        methods: {

        },
        computed: {


        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
