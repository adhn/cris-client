<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Projects</h3>
                        <v-spacer />
                        <v-btn flat :to="{ name: 'projects'}"><v-icon>open_in_new</v-icon></v-btn>
                        <company-projects-attach-dialog />
                        <company-projects-new-dialog />

                        <!-- <v-btn flat color="primary" :to="{ name: 'projects-new'}"><v-icon>add</v-icon></v-btn> -->
                    </v-card-title>
                    <v-card-text>
                            
                            <v-data-table
                                    v-bind:headers="headers"
                                    v-bind:items="projects"
                                    v-bind:rows-per-page-items='[10,25,50]'
                            >
                                <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
                                <template slot="items" slot-scope="props">
                                    <td>
                                        <v-btn flat :to="{ name: 'projects-id', params: { id: props.item.id }}">
                                            {{ props.item.name }}
                                        </v-btn>
                                    </td>
                                    <td>
                                        <template v-if="props.item.active">
                                            Active
                                        </template>
                                        <template v-else>
                                            Archive
                                        </template>
                                    </td>
                                    <td>
                                        <project-role-cell-render :project_role_id="getProjectRoleId(props.item)" />
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
    import ProjectRoleCellRender from '~/components/Project/ProjectRoleCellRender.vue';
    import CompanyProjectsAttachDialog from '~/components/Company/CompanyProjectsAttachDialog.vue';
    import CompanyProjectsNewDialog from '~/components/Company/CompanyProjectsNewDialog.vue';

    export default {
        components: {
            ProjectRoleCellRender,
            CompanyProjectsAttachDialog,
            CompanyProjectsNewDialog
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
                    text: 'Status',
                    align: 'left',
                    sortable: true,
                    value: 'active'
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
            getCompany(project) {
                let companies = [...this.associatedWithCompanies]
                let companyId = companies.pop()
                return project.companies.find(company => company.id == companyId)
            },
            getProjectRoleId(project) {
                let company = this.getCompany(project)
                // console.info('getProjectRoleId company',company)
                return company.project_role_id       
            }
        },
        computed: {
            ...mapGetters('project_list',['projects','associatedWithCompanies']),
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
