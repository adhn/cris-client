<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-btn slot="activator" flat color="primary"><v-icon>add</v-icon></v-btn>
        <v-card>

        <v-toolbar>

          <v-toolbar-title>Add new checklist to Project</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat color="" @click="dialog = false">
                Close
                <v-icon right>close</v-icon>
            </v-btn>
            <v-btn class ="ml-3" flat large color="primary" @click="save()">Save<v-icon right>save</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>


            <!-- <v-card-title>
                <h2></h2>
            </v-card-title> -->
            <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs5>
                            <v-text-field :label="'Name'" v-model="name" />
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs5>
                            <checklist-template-field :label="'Checklist Template'" v-model="checklist_template_id" />
                        </v-flex>
                        <v-flex xs6 ml-3>
                            <p></p>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                            <v-spacer />
                            <v-btn color="primary" @click="addChecklistItem()"><v-icon left>add</v-icon>Add Checklist Item</v-btn>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs12>
                            <checklist :enabled="true"/>
                        </v-flex>
                    </v-layout>                    
            </v-card-text>
            <!-- <v-card-actions> -->
                <!-- <v-spacer /> -->
                <!-- <v-btn color="secondary" flat @click="dialog=false">Close</v-btn> -->
                <!-- <v-btn color="primary" @click="save()">Save</v-btn> -->
            <!-- </v-card-actions> -->
        </v-card>
    </v-dialog>    
</template>
<script>
    // import {mapGetters} from 'vuex';
    import ChecklistTemplateField from '~/components/Fields/ChecklistTemplateField.vue'
    import ChecklistTemplateChecklistItemList from '~/components/ChecklistTemplate/ChecklistTemplateChecklistItemList.vue'
    import Checklist from '~/components/Checklist/Checklist.vue'

    export default {
        props: ['projectId'],
        components: {
            Checklist,
            ChecklistTemplateField,
            ChecklistTemplateChecklistItemList
        },
        data: () => ({
            dialog: false,
            // checklistItems: [],
            checklist_template_id: null
        }),
        methods: {
            save() {
                this.$store.dispatch('checklist/save').then(this.dialog = false)
            },
            addChecklistItem() {
                this.$store.commit('checklist/addChecklistItem')
            },
        },
        computed: {
            checklistItems: {
                get () { return this.$store.getters['checklist/checklistItems'] },
                set (value) { this.$store.commit('checklist/checklistItems',value) }
            },
            project_id: {
                get () { return this.$store.getters['checklist/project_id'] },
                set (value) { this.$store.commit('checklist/project_id',value) }
            },
            name: {
                get () { return this.$store.getters['checklist/name'] },
                set (value) { this.$store.commit('checklist/name',value) }
            },
        },
        watch: {
            dialog(value,oldValue) {
                if(value == true) {
                    // dialog has been opened
                    this.$store.commit('checklist/new')
                    this.project_id = this.$store.getters['project/id']
                }
                this.$store.commit('visibility/visible',!value)
            },
            checklist_template_id(value,oldVal) {
                if(value) {
                    let checklistTemplate = this.$store.getters['checklist_template_field/getById'](value)
                    if(checklistTemplate) {
                        this.checklistItems = [...checklistTemplate.checklistItems]
                    }    
                }
            }

        },
        mounted: function() {

        }
    }
</script>