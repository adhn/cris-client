<template>    
        <v-layout row mb-3>
            <v-flex xs12>
                <v-card>
    <v-toolbar app color="white" prominent>
                        <span class="headline">{{name}}</span>
                        <v-spacer />
                        <v-flex xs2>
                            <v-select v-if="isEditable"
                                v-model="active"
                                :label="'Project Status'"
                                :items="[{name:'ACTIVE',id:true},{name:'ARCHIVED',id:false}]"
                                item-text="name"
                                item-value="id"
                            />
                        </v-flex>
                        <v-btn v-if="isEditable" color="error" @click="deleteProject(id)"><v-icon left>delete</v-icon>Delete</v-btn>
                        <v-btn v-if="isEditable" color="primary" :to="{ name: 'projects-edit-id', params: { id: id }}"><v-icon left>edit</v-icon>Edit</v-btn>

    </v-toolbar>
                        <v-card-text>

                        <v-layout row wrap>
                            <v-flex xs3>
                                Project ID
                            </v-flex>
                            <v-flex xs3>
                                {{id}}
                            </v-flex>

                            <v-flex xs3>
                                Companies involved
                            </v-flex>

                            <v-flex xs3>
                                {{projectCompaniesCount}}
                            </v-flex>
                        </v-layout>
                        
                        <v-layout row wrap>
                            <v-flex xs3>
                                Project Status
                            </v-flex>
                            <v-flex xs3>
                                    <template v-if="active">
                                        Active
                                    </template>
                                    <template v-else>
                                        Archived
                                    </template>
                            </v-flex>

                            <v-flex xs3>
                                Contacts involved
                            </v-flex>

                            <v-flex xs3>
                                {{contactsCount}}
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs3>
                                Project Type
                            </v-flex>
                            <v-flex xs3>
                                <template v-if="project.projectType">
                                    {{project.projectType.name}}
                                </template>
                            </v-flex>

                            <v-flex xs3>
                                Open checklists progress
                            </v-flex>

                            <v-flex xs3>
                                 {{project.progress_total-project.progress_todo}}/{{project.progress_total}}
                                <checklist-progress :total="project.progress_total" :todo="project.progress_todo" />

                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            &nbsp;
                        </v-layout>

                        <v-layout row wrap>
                            &nbsp;
                        </v-layout>


                        <v-layout row wrap>
                            <v-flex xs3>
                                Issuer
                            </v-flex>
                            <v-flex xs3>
                                <template v-if="project.issuerCompany">
                                    <router-link :to="{ name: 'companies-id', params: { id: project.issuerCompany.id }}">
                                        {{ project.issuerCompany.name }}
                                    </router-link>
                                </template>
                            </v-flex>

                            <v-flex xs3>
                                Issuer Country
                            </v-flex>

                            <v-flex xs3>
                                <template v-if="project.issuerCountry">
                                    {{project.issuerCountry.name}}
                                </template>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs3>
                                Guarantor
                            </v-flex>
                            <v-flex xs3>
                                <template v-if="project.guarantorCompany">
                                    <router-link :to="{ name: 'companies-id', params: { id: project.guarantorCompany.id }}">
                                        {{ project.guarantorCompany.name }}
                                    </router-link>
                                </template>
                            </v-flex>

                            <v-flex xs3>
                                Guarantor Country
                            </v-flex>

                            <v-flex xs3>
                                <template v-if="project.guarantorCountry">
                                    {{project.guarantorCountry.name}}
                                </template>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs3>
                                Underlying stock name
                            </v-flex>
                            <v-flex xs3>
                                {{underlying_stock_name}}
                            </v-flex>

                            <v-flex xs3>
                                Underlying stock country
                            </v-flex>

                            <v-flex xs3>
                                <template v-if="project.underlyingStockCountry">
                                    {{project.underlyingStockCountry.name}}
                                </template>
                            </v-flex>
                        </v-layout>

                        <one-drive-location :label="'Files:'" :disabled="true" v-model="onedrive_folder_location" />

                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import ChecklistProgress from '~/components/Checklist/ChecklistProgress.vue'
    import OneDriveLocation from '~/components/OneDriveLocation.vue'

    export default {
        props: ['projectId'],
        components: {
            ChecklistProgress,
            OneDriveLocation
        },
        data: () => ({

        }),
        methods: {
            deleteProject(id) {
                let answer = confirm("Are you sure you want to delete this project?\n\nIt will be soft-deleted and only an Admin will be able to restore it") 
                if(answer) {
                    let that = this
                    this.$store.dispatch('project/deleteProject',id).then(function() {
                        that.$router.push('/projects')
                    })
                }
            },
        },
        computed: {
            ...mapGetters('project',[
                'project','projectCompaniesCount','id','name','whiteboard_1','whiteboard_2','whiteboard_3',
                'underlying_stock_name','project_type_id','issuer_country_id',
                'guarantor_country_id','underlying_stock_country_id','issuer_company_id',
                'guarantor_company_id','onedrive_folder_location']),

            active: {
                get () { return this.$store.getters['project/active'] },
                set (value) { 
                    this.$store.commit('project/active',value) 
                    this.$store.dispatch('project/save')
                }
            },

            contactsCount: {
                get() { return this.$store.getters['contact_list/total']},
            },
            ...mapGetters('auth',['isAdmin']),        
            isEditable() {
                if(this.active || this.isAdmin == true) {
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
