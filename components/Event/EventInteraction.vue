<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Interactions</h3>
                        <v-spacer />
                        <v-btn flat :to="{ name: 'interactions'}"><v-icon>open_in_new</v-icon></v-btn>
                        <event-interactions-attach-dialog />
                        <event-interactions-new-dialog />
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
    import EventInteractionsAttachDialog from '~/components/Event/EventInteractionsAttachDialog.vue'
    import EventInteractionsNewDialog from '~/components/Event/EventInteractionsNewDialog.vue'
    export default {
        props: [],
        components: {
            InteractionList,
            EventInteractionsAttachDialog,
            EventInteractionsNewDialog
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
