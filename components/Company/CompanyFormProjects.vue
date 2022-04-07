<template>
    <v-card>
        <v-card-title>
            <h3>Attached Project</h3>
        </v-card-title>
        <v-card-text>
                <v-layout row wrap>
                <v-flex xs5>
                    <project-role-field :filtered="true" :label="'Project Role'" v-model="selectedProjectRole"/>
                </v-flex>
                <v-flex ml-3 xs5>
                    <project-field :label="'Project'" v-model="selectedProject"/>
                </v-flex>
                </v-layout>
        </v-card-text>
    </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import ProjectRoleField from '~/components/Fields/ProjectRoleField.vue'
    export default {
        props: ['value'],
        components: {ProjectField,ProjectRoleField},
        data: () => ({
            selectedProject: null,
            selectedProjectRole: null,

        }),
        methods: {
            onChange() {
                this.$emit('input',{
                    selectedProject:this.selectedProject,
                    selectedProjectRole: this.selectedProjectRole
                })
            }
        }, 
        computed: {

        },
        mounted: function() {
            Promise.all([
                this.$store.dispatch('project_field/fetchProjects'),
                this.$store.dispatch('project_role_field/fetchProjectRoles'),
            ])
        },
        watch: {
            value(value,oldVal) {
                console.info('CompanyFormProjects value watch',value)
                if(value) {
                    // console.info('CompanyFormProjects value',this.value)
                    if(value.selectedProject) {
                        this.selectedProject = value.selectedProject
                        // console.info('CompanyFormProjects selectedProject',this.selectedProject)
                    }

                    if(value.selectedProjectRole) {
                        this.selectedProjectRole = value.selectedProjectRole
                    }
                }
            },
            selectedProject(value) {
                this.onChange()
            },
            selectedProjectRole(value) {
                this.onChange()
            }

        }
    }
</script>
