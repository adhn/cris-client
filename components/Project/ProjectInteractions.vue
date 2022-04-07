<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Interactions</h3>

                        <v-spacer />
                            <v-btn flat :to="{ name: 'interactions'}"><v-icon>open_in_new</v-icon></v-btn>
                            <project-interactions-attach-dialog />
                            <project-interactions-new-dialog />
                            <!-- <v-btn :to="{ name: 'interactions-new'}" flat color="primary"><v-icon>add</v-icon></v-btn> -->
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
    import ProjectInteractionsAttachDialog from '~/components/Project/ProjectInteractionsAttachDialog.vue'
    import ProjectInteractionsNewDialog from '~/components/Project/ProjectInteractionsNewDialog.vue'

    import InteractionList from '~/components/InteractionList/InteractionList.vue'
    export default {
        props: [],
        components: {
            InteractionList,
            ProjectInteractionsAttachDialog,
            ProjectInteractionsNewDialog
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
