<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <h3>Main Information</h3>
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-text-field label="Event Title" v-model="name"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                                <event-type-field :label="'Event Type'" v-model="event_type_id" :multiple="false"/>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                            <project-field :label="'Project'" v-model="project_id" />
                        </v-flex>
                    </v-layout>

                    <one-drive-location :value="onedrive_folder_location" :label="'Select Event folder location'"/>


                    <template v-if="!id">
                    <v-layout row wrap>
                        <v-flex xs3>
                            <checklist-template-field :label="'Checklist Template'" v-model="checklist_template_id" />
                        </v-flex>
                        <v-flex xs8 ml-3>
                            <p>Choosing a checklist template will show a <strong>read-only</strong> list of the checklist items below.<br />
                            Once the event is saved, the checklist items from the template will be copied into a writeable checklist belonging to this event.
                            </p>
                        </v-flex>
                    </v-layout>
                    </template>
                </v-card-text>
            </v-card>
        </v-flex>

        <event-form-details />

        <template v-if="id">
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Event checklist</h3>
                        <v-spacer />
                        <v-btn color="primary" @click="addChecklistItem()"><v-icon left>add</v-icon>Add Checklist Item</v-btn>
                    </v-card-title>
                    <v-card-text>
                        <checklist :enabled="true"/>
                    </v-card-text>
                </v-card>
            </v-flex>
        </template>
        <template v-else>
            <template v-if="checklist_template_id">
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Checklist Template Items</h3>
                    </v-card-title>
                    <v-card-text>
                            <checklist-template-checklist-item-list :checklistItems="checklistItems" :enabled="false"/>
                    </v-card-text>
                </v-card>
            </v-flex>
            </template>
        </template>
    </v-layout>

</template>

<script>
    import EventTypeField from '~/components/Fields/EventTypeField.vue'
    import EventFormDetails from '~/components/Event/EventFormDetails.vue'
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import ChecklistTemplateField from '~/components/Fields/ChecklistTemplateField.vue'
    import ChecklistTemplateChecklistItemList from '~/components/ChecklistTemplate/ChecklistTemplateChecklistItemList.vue'
    import Checklist from '~/components/Checklist/Checklist.vue'
    import OneDriveLocation from '~/components/OneDriveLocation.vue'

    // https://forum.vuejs.org/t/vuejs-sending-v-model-property-from-child-to-parent/22884/2

    export default {
        components: {
            EventTypeField,ProjectField,ChecklistTemplateField,
            ChecklistTemplateChecklistItemList,Checklist,EventFormDetails,OneDriveLocation
        },
        data: () => ({
            checklistItems: []
        }),
        computed: {
            id: {
                get () { return this.$store.getters['event/id'] },
                // set (value) { this.$store.commit('event/id',value) }
            },
            event_type_id: {
                get () { return this.$store.getters['event/event_type_id'] },
                set (value) { this.$store.commit('event/event_type_id',value) }
            },
            project_id: {
                get () { return this.$store.getters['event/project_id'] },
                set (value) { this.$store.commit('event/project_id',value) }
            },
            checklist_template_id: {
                get () { return this.$store.getters['event/checklist_template_id'] },
                set (value) { 
                    this.$store.commit('event/checklist_template_id',value) 
                    let checklistTemplate = this.$store.getters['checklist_template_field/getById'](value)
                    if(checklistTemplate) {
                        this.checklistItems = checklistTemplate.checklistItems
                        // console.info(this.checklistItems)
                    }    
                }
            },
            status: {
                get () { return this.$store.getters['event/status'] },
                set (value) { this.$store.commit('event/status',value) }
            },
            name: {
                get () { return this.$store.getters['event/name'] },
                set (value) { this.$store.commit('event/name',value) }
            },
            whiteboard_1: {
                get () { return this.$store.getters['event/whiteboard_1'] },
                set (value) { this.$store.commit('event/whiteboard_1',value) }
            },
            whiteboard_2: {
                get () { return this.$store.getters['event/whiteboard_2'] },
                set (value) { this.$store.commit('event/whiteboard_2',value) }
            },
            whiteboard_3: {
                get () { return this.$store.getters['event/whiteboard_3'] },
                set (value) { this.$store.commit('event/whiteboard_3',value) }
            },
            onedrive_folder_location: {
                get () { return this.$store.getters['event/onedrive_folder_location'] },
                set (value) { this.$store.commit('event/onedrive_folder_location',value) }
            },                                                                                                      
        },
        methods: {
            addChecklistItem() {
                this.$store.commit('checklist/addChecklistItem')
            },
        },
        watch: {

        }
    }
</script>