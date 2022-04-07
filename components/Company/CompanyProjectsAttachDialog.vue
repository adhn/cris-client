<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-btn slot="activator" flat color="primary"><v-icon>attachment</v-icon></v-btn>
        <v-card>
            <v-card-title>
                <h2>Attach existing project</h2>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                <v-flex xs5>
                    <project-role-field :filtered="true" :label="'Project Role'" v-model="selectedProjectRole"/>
                </v-flex>
                <v-flex ml-3 xs5>
                    <project-field :label="'Project'" v-model="selectedProject"/>
                </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" flat @click="dialog=false">Close</v-btn>
                <v-btn color="primary" @click="attach()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>    
</template>
<script>
    // import {mapGetters} from 'vuex';
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import ProjectRoleField from '~/components/Fields/ProjectRoleField.vue'
    export default {
        props: [],
        components: {
            ProjectField,
            ProjectRoleField
        },
        data: () => ({
            dialog: false,
            selectedProject: null,
            selectedProjectRole: null
        }),
        methods: {
            attach() {
                if(this.selectedProject && this.selectedProjectRole) {
                    Promise.all([
                        this.$store.dispatch('company/associateProject',{
                            project_id:this.selectedProject,
                            project_role_id:this.selectedProjectRole
                        }
                    )]
                    ).then(this.dialog=false)        
                }
            }
        },
        computed: {

        },
        watch: {
            dialog(value,oldValue) {
                this.$store.commit('visibility/visible',!value)
            }
        },
        mounted: function() {
            this.$store.dispatch('project_field/fetchProjects')
            this.$store.dispatch('project_role_field/fetchProjectRoles')
        }
    }
</script>