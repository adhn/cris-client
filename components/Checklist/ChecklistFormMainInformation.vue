<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <!-- <v-card-title>
                    <h3>{{title}}</h3>
                </v-card-title> -->
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-text-field label="Checklist Name" v-model="name"></v-text-field>
                        </v-flex>
                        <v-flex xs3 ml-3>

                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-select :items="statuses" :multiple="false" label="Status" v-model="status" />
                        </v-flex>
                        <v-flex xs3 ml-3>

                        </v-flex>
                    </v-layout>

                    <template v-if="!id">
                    <v-layout row wrap>
                        <v-flex xs3>
                            <checklist-template-field :label="'Checklist Template'" v-model="checklist_template_id" />
                        </v-flex>
                        <v-flex xs3 ml-3>
                        </v-flex>
                    </v-layout>
                    </template>

                    <template v-if="project_id">
                        <v-layout row wrap>
                            <v-flex xs3>
                                <project-field :label="'Project'" :readonly="true" :clearable="false" v-model="project_id" />
                            </v-flex>
                            <v-flex xs3 ml-3>
                            </v-flex>
                        </v-layout>
                    </template>
                </v-card-text>
            </v-card>
        </v-flex>


        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <h3>Checklist Items</h3>
                    <v-spacer />
                    <v-btn v-if="!id" color="warning" @click="clearAllChecklistItems()"><v-icon left>warning</v-icon>Reset</v-btn>
                    <v-btn color="primary" @click="addChecklistItem()"><v-icon left>add</v-icon>Add Checklist Item</v-btn>
                </v-card-title>
                <v-card-text>
                        <checklist :enabled="true"/>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import ChecklistTemplateField from '~/components/Fields/ChecklistTemplateField.vue'
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import Checklist from '~/components/Checklist/Checklist.vue'
    import {mapGetters} from 'vuex';

    export default {
        props: ['title'],
        components: {ChecklistTemplateField,Checklist,ProjectField},
        data: () => ({
                checklist_template_id: null,
                statuses: [
                    {value:'ACTIVE',text:'Active'},
                    {value:'COMPLETED',text:'Completed'}
                ]
        }),
        computed: {
            ...mapGetters('checklist',['id','project_id','event_id']),

            name: {
                get () { return this.$store.getters['checklist/name'] },
                set (value) { this.$store.commit('checklist/name',value) }
            },
            status: {
                get () { return this.$store.getters['checklist/status'] },
                set (value) { this.$store.commit('checklist/status',value) }
            },
            checklistItems: {
                get () { return this.$store.getters['checklist/checklistItems'] },
                set (value) { this.$store.commit('checklist/checklistItems',value) }
            },                                                                                                                     
        },
        methods: {
            addChecklistItem() {
                this.$store.dispatch('checklist/addChecklistItem')
            },
            clearAllChecklistItems() {
                this.$store.commit('checklist/clearAllChecklistItems')
            },
            getProjectName(project_id) {
                let project = this.$store.getters['project_field/getById'](project_id)
                if(project) {
                    return project.name
                } else {
                    return ''
                }
            }
            
        },
        watch: {
            checklist_template_id(id,oldVal) {
                if(id) {
                    let checklistTemplate = this.$store.getters['checklist_template_field/getById'](id)
                    if(checklistTemplate) {
                        this.$store.commit('checklist/addChecklistItems',checklistTemplate.checklistItems)
                    }    
                }
            }
        }
    }
</script>