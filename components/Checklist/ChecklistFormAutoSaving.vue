<template>
        <v-card-text>
            <v-layout row wrap>
                <v-flex xs6>
                        <v-text-field ref="checklist_name" label="Checklist Name" v-model="name" :loading="nameLoading"></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs6>
                        <v-select ref="checklist_status" :items="statuses" :multiple="false" label="Status" v-model="status" :loading="statusLoading" />
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-spacer />
                <v-flex xs2>
                <v-btn color="primary" @click="addChecklistItem()"><v-icon left>add</v-icon>Add Checklist Item</v-btn>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs12>
                    <checklist :enabled="enabled"/>
                </v-flex>
            </v-layout>
        </v-card-text>
</template>

<script>
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import Checklist from '~/components/Checklist/Checklist.vue'
    import {mapGetters} from 'vuex';

    export default {
        props: ['title','loading'],
        components: {Checklist,ProjectField},
        data: () => ({
                checklist_template_id: null,
                statuses: [
                    {value:'ACTIVE',text:'Active'},
                    {value:'COMPLETED',text:'Completed'}
                ],
                enabled: true
        }),
        computed: {
            ...mapGetters('checklist',['id','project_id','event_id']),

            name: {
                get () { return this.$store.getters['checklist/name'] },
                set (value) { 
                    this.$store.dispatch('checklist/delayedUpdateChecklist',{    
                        value: value,
                        field: 'name'
                    }) 
                }
            },
            nameLoading: {
                get () { return this.$store.getters['checklist/loadingFields']('name') }
            },
            statusLoading: {
                get () { return this.$store.getters['checklist/loadingFields']('status') }
            },

            status: {
                get () { return this.$store.getters['checklist/status'] },
                set (value) { 
                    this.$store.dispatch('checklist/updateChecklist',{    
                        value: value,
                        field: 'status'
                    })                 
                }
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
            status(val,oldVal) {
                if(val == 'ACTIVE') {
                    this.enabled = true
                } else {
                    this.enabled = false
                }
            },
            // nameLoading(val,oldVal) {
            //     if(val) {
            //         this.$refs['checklist_name']['append-outer-icon'] = 'add'
            //     } else {
            //         this.$refs['checklist_name']['append-outer-icon'] = 'success'
            //     }
            // },
            // statusLoading(val,oldVal) {

            // }
        }
    }
</script>

<style>

</style>