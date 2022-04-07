<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Companies</h3>
                        <v-spacer />
                        <v-btn flat :to="{ name: 'companies'}"><v-icon>open_in_new</v-icon></v-btn>
                        <project-companies-attach-dialog />
                        <project-companies-new-dialog />
                    </v-card-title>
                    <v-card-text>
                            
                            <v-data-table
                                    v-bind:headers="headers"
                                    v-bind:items="companies"
                                    v-bind:rows-per-page-items='[10,25,50]'
                                    item-key="key"
                            >
                                <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
                                <template slot="items" slot-scope="props">
                                    <td>
                                        <v-btn flat :to="{ name: 'companies-id', params: { id: props.item.id }}">
                                            {{ props.item.name }}
                                        </v-btn>
                                    </td>
                                    <td>
                                        <project-role-cell-render  :project_role_id="getProjectRoleId(props.item)" />
                                    </td>
                                </template>
                                <template slot="no-data">
                                    <v-alert :value="true" type="info" outline color="info" icon="info">
                                        Sorry, nothing to display here :( 
                                    </v-alert>
                                </template>
                            </v-data-table>

                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import ProjectRoleCellRender from '~/components/Project/ProjectRoleCellRender.vue'
    import ProjectCompaniesAttachDialog from '~/components/Project/ProjectCompaniesAttachDialog.vue'
    import ProjectCompaniesNewDialog from '~/components/Project/ProjectCompaniesNewDialog.vue'

    export default {
        props: ['projectId'],
        components: {
            ProjectRoleCellRender,
            ProjectCompaniesAttachDialog,
            ProjectCompaniesNewDialog
        },
        data: () => ({
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    sortable: true,
                    value: 'name'
                },
                {
                    text: 'Role in project',
                    align: 'left',
                    sortable: true,
                    value: 'project_role_id'
                },

            ]
        }),
        methods: {
            getProject(company) {
                let projects = [...this.selectedProjects]
                let projectId = projects.pop()
                return company.projects.find(project => project.id == projectId)
            },
            getProjectRoleId(company) {
                let project = this.getProject(company)
                // console.info('getProjectRoleId company',company)
                return project.project_role_id       
            }
        },
        computed: {
            ...mapGetters('company_list',['companies','selectedProjects']),

        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
