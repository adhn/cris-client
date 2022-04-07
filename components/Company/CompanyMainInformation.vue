<template>    
        <v-layout row mb-3>
            <v-flex xs12>
                <v-card>
    <v-toolbar app color="white" prominent>
                        <span class="headline">{{name}}</span>
                        <v-spacer />
                        <v-flex xs2>
                        <v-select v-if="isEditable"
                            v-model="status"
                            :label="'Company Status'"
                            :items="companyStatuses"
                            item-text="name"
                            item-value="id"
                        />
                        </v-flex>
                        <v-btn v-if="isEditable" color="error" @click="deleteCompany(id)">Delete</v-btn>


                        <v-btn v-if="isEditable" color="primary" :to="{ name: 'companies-edit-id', params: { id: id }}">Edit</v-btn>

    </v-toolbar>
                    <v-card-text>

                        <v-layout row wrap>
                            <v-flex xs3>
                                Company ID
                            </v-flex>
                            <v-flex xs3>
                                {{id}}
                            </v-flex>

                            <v-flex xs3>
                                Primary Contact
                            </v-flex>

                            <v-flex xs3>
                                <template v-if="company.primaryContact">
                                {{company.primaryContact.display_name}}
                                </template>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs3>
                                Status
                            </v-flex>
                            <v-flex xs3>
                                {{status}}
                            </v-flex>

                            <v-flex xs3>
                                Billing Contact
                            </v-flex>

                            <v-flex xs3>
                                <template v-if="company.billingContact">
                                    {{company.billingContact.display_name}}
                                </template>
                            </v-flex>
                        </v-layout>
                        

                        <v-layout row wrap>
                            <v-flex xs3>
                                Company Address
                            </v-flex>
                            <v-flex xs9>
                                  <nl2br tag="p" :text="company_address" />
                            </v-flex>
                        </v-layout>
                        
                        <v-layout row wrap>
                            <v-flex xs3>
                                
                            </v-flex>
                            <v-flex xs3>
                                
                            </v-flex>

                            <v-flex xs3>
                                Active projects
                            </v-flex>

                            <v-flex xs3>
                                {{activeCount}}
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs3>
                                
                            </v-flex>
                            <v-flex xs3>
                                
                            </v-flex>

                            <v-flex xs3>
                                Total projects
                            </v-flex>

                            <v-flex xs3>
                                {{total}}
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs3>
                                
                            </v-flex>
                            <v-flex xs3>
                                
                            </v-flex>

                            <v-flex xs3>
                                Contacts
                            </v-flex>

                            <v-flex xs3>
                                {{contactsCount}}
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs3>
                                Is a client?
                            </v-flex>
                            <v-flex xs3>
                                <template v-if="is_client">
                                    YES
                                </template>
                                <template v-else>
                                    NO
                                </template>
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
    import Nl2br from 'vue-nl2br'
    import OneDriveLocation from '~/components/OneDriveLocation.vue'

    export default {
        props: [],
        components: {
            Nl2br,
            OneDriveLocation
        },
        data: () => ({
            companyStatuses: [
                {id:'ACTIVE',name:'ACTIVE'},
                {id:'PROSPECT',name:'PROSPECT'},
                {id:'ARCHIVED',name:'ARCHIVED'},
            ]
        }),
        methods: {
            deleteCompany(id) {
                let answer = confirm("Are you sure you want to delete this company?\n\nIt will be soft-deleted and only an Admin will be able to restore it") 
                if(answer) {
                    let that = this
                    this.$store.dispatch('company/deleteCompany',id).then(function () {
                        that.$router.push('/companies')
                    })
                }
            },

        },
        computed: {
            ...mapGetters('company',['company','name','id','is_client','status','company_address','onedrive_folder_location']),
            ...mapGetters('project_list',['activeCount','total']),     
            status: {
                get () { return this.$store.getters['company/status'] },
                set (value) { 
                    this.$store.commit('company/status',value) 
                    this.$store.dispatch('company/save')

                }
            },
            contactsCount: {
                get() { return this.$store.getters['contact_list/total']},
            },  
            ...mapGetters('auth',['isAdmin']),
            isEditable() {
                console.info('CompanyMainInformation isEditable',this.status,this.isAdmin)
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
