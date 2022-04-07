<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-btn slot="activator" flat color="primary"><v-icon>add</v-icon></v-btn>
        <v-card>

        <v-toolbar>
          <v-toolbar-title>Add new company to project</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat color="" @click="dialog = false">
                Close
                <v-icon right>close</v-icon>
            </v-btn>
            <v-btn class ="ml-3" flat large color="primary" @click="save()">Save<v-icon right>save</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
            <v-card-text>
                    <company-form-main-information />
                    <company-form-projects v-model="selectedProjectData" />
            </v-card-text>
        </v-card>
    </v-dialog>    
</template>
<script>

    // import EventForm from '~/components/Event/EventForm.vue'
    import CompanyFormMainInformation from '~/components/Company/CompanyFormMainInformation.vue'
    import CompanyFormProjects from '~/components/Company/CompanyFormProjects.vue'

    export default {
        props: ['projectId'],
        components: {
            CompanyFormMainInformation,
            CompanyFormProjects
        },
        data: () => ({
            dialog: false,
            selectedProjectData: {
                selectedProject: null,
                selectedProjectRole: null
            },
            loading: false
        }),
        methods: {
            save() {
                this.$store.commit('loading/loading',true)
                Promise.all([
                    this.$store.dispatch('company/save')    
                ]).then(saveResponse => {
                    // console.info('saveResponse',saveResponse)
                    console.info('ProjectCompaniesNewDialog save this.selectedProjectData',this.selectedProjectData)
                    Promise.all([
                        this.$store.dispatch('company/associateProject',{
                            project_id: this.selectedProjectData.selectedProject,
                            project_role_id: this.selectedProjectData.selectedProjectRole
                        })
                    ]).then(associateResponse => {
                        // console.info('associateResponse',associateResponse)
                        this.dialog = false
                        this.loading = false
                        // this.$store.dispatch('company_list/fetchCompanies')
                        this.$store.commit('loading/loading',false)

                    })
                })
                // this.$store.dispatch('company/save').then(this.$store.dispatch('company/associateProject',{
                //     project_id: this.selectedProjectData.selectedProject,
                //     project_role_id: this.selectedProjectData.selectedProjectRole
                // })).then(this.dialog = false)
            },
            setSelectedProjectdata() {
                console.info('ProjectCompaniesNewDialog setSelectedProjectData')
                this.selectedProjectData = {
                    selectedProject: this.$store.getters['project/id'],
                    selectedProjectRole: null
                }
            }
        },
        computed: {
            // project_id: {
            //     get () { return this.$store.getters['event/project_id'] },
            //     set (value) { this.$store.commit('event/project_id',value) }
            // },
            // name: {
            //     get () { return this.$store.getters['event/name'] },
            //     set (value) { this.$store.commit('event/name',value) }
            // },
        },
        watch: {
            dialog(value,oldValue) {
                if(value == true) {
                    Promise.all([
                        this.$store.commit('company/reset'),
                        this.$store.dispatch('contact_field/fetchContacts'),
                        this.$store.dispatch('project_field/fetchProjects'),
                        this.$store.dispatch('project_role_field/fetchProjectRoles')
                    ]).then(this.setSelectedProjectdata())
                }
                this.$store.commit('visibility/visible',!value)
            },

        },
        mounted: function() {
            this.setSelectedProjectdata()
        }
    }
</script>