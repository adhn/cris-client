<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Events</h3>
                        <v-spacer />
                        <v-btn flat :to="{ name: 'events'}"><v-icon>open_in_new</v-icon></v-btn>
                        <project-events-new-dialog />
                        <!-- <v-btn flat color="primary" :to="{ name: 'events-new'}"><v-icon>add</v-icon></v-btn> -->
                    </v-card-title>
                    <v-card-text>
                        <event-list />
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import EventList from '~/components/EventList/EventList.vue'
    import ProjectEventsNewDialog from '~/components/Project/ProjectEventsNewDialog.vue'
    export default {
        props: ['projectId'],
        components: {
            EventList,
            ProjectEventsNewDialog
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
