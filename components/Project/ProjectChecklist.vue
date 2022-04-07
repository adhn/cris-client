<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Checklists</h3>
                        <v-spacer />
                        <project-checklist-new-dialog :projectId="projectId" />
                    </v-card-title>
                    <v-card-text>
                        <checklist-list />
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import ChecklistList from '~/components/ChecklistList/ChecklistList.vue'
    import ProjectChecklistNewDialog from '~/components/Project/ProjectChecklistNewDialog.vue'
    export default {
        props: ['projectId'],
        components: {
            ChecklistList,
            ProjectChecklistNewDialog
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
