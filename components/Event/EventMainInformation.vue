<template>    
        <v-layout row mb-3>
            <v-flex xs12>
                <v-card>
        <v-toolbar app color="white">
                        <span class="headline">{{name}}</span>
                        <v-spacer />
                        <v-flex xs2>
                            <v-select v-if="isEditable"
                                v-model="status"
                                :label="'Event Status'"
                                :items="[{name:'ACTIVE',id:'ACTIVE'},{name:'ARCHIVED',id:'ARCHIVED'}]"
                                item-text="name"
                                item-value="id"
                            />
                        </v-flex>
                        <v-btn v-if="isEditable" color="error" @click="deleteEvent(id)"><v-icon left>delete</v-icon>Delete</v-btn>
                        <v-btn v-if="isEditable" color="primary" :to="{ name: 'events-edit-id', params: { id: id }}"><v-icon left>edit</v-icon>Edit</v-btn>

        </v-toolbar>
                        <v-card-text>

                        <v-layout row wrap>
                            <v-flex xs3>
                                Event ID
                            </v-flex>
                            <v-flex xs3>
                                {{id}}
                            </v-flex>

                            <v-flex xs3>
                            </v-flex>

                            <v-flex xs3>
                            </v-flex>
                        </v-layout>
                        
                        <v-layout row wrap>
                            <v-flex xs3>
                                Event Status
                            </v-flex>
                            <v-flex xs3>
                                {{status | toTitleCase}}
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs3>
                                Issuer
                            </v-flex>
                            <v-flex xs3>
                                <template v-if="event.project && event.project.issuerCompany">
                                {{event.project.issuerCompany.name}}
                                </template>
                            </v-flex>

                            <v-flex xs3>
                                Checklist
                            </v-flex>

                            <v-flex xs3>
                                <template v-if="event.checklist">
                                    {{event.checklist.name}}
                                </template>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs3>
                                Project
                            </v-flex>
                            <v-flex xs3>
                                <template v-if="event.project">
                                    {{event.project.name}}
                                </template>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs3>

                            </v-flex>
                            <v-flex xs3>

                            </v-flex>
                            <v-flex xs3>
                                Date Created
                            </v-flex>
                            <v-flex xs3>
                                {{created_at | iso-8601-date-to-european-format}}
                                <!-- {{created_at}} -->
                            </v-flex>
                        </v-layout>



                        <v-layout row wrap>
                            <v-flex xs3>
                                Type of Event
                            </v-flex>
                            <v-flex xs3>
                                {{eventTypeName}}
                            </v-flex>

                            <v-flex xs3>
                                Next action date
                            </v-flex>

                            <v-flex xs3>
                                {{actionDate | iso-8601-date-to-european-format}}
                            </v-flex>
                        </v-layout>

                        <one-drive-location :label="'Files:'" :disabled="true" :value="onedrive_folder_location" />

                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import OneDriveLocation from '~/components/OneDriveLocation.vue'

    export default {
        props: [],
        components: {
            OneDriveLocation
        },
        data: () => ({

        }),
        methods: {
            deleteEvent(id) {
                let answer = confirm("Are you sure you want to delete this event?\n\nIt will be soft-deleted and only an Admin will be able to restore it") 
                if(answer) {
                    let that = this
                    this.$store.dispatch('event/deleteEvent',id).then(resp => {
                        that.$router.push('/events')
                    })
                }
            },
        },
        computed: {
            ...mapGetters('event',['event','id','name','event_type_id','project_id','checklist_id','created_at','actionDate','onedrive_folder_location']),
            status: {
                get () { return this.$store.getters['event/status'] },
                set (value) { 
                    this.$store.commit('event/status',value) 
                    this.$store.dispatch('event/save')

                }
            },
            eventTypeName() {
                if(this.event_type_id) {
                    let eventType = this.$store.getters['event_type_field/getById'](this.event_type_id)
                    if(eventType) {
                        return eventType.name
                    }
                }
            },
            ...mapGetters('auth',['isAdmin']),        
            isEditable() {
                if(this.status != 'ARCHIVED' || this.isAdmin == true) {
                    return true
                }
                return false
            }
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
