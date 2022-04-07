<template>
    <div>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="companies"
                v-bind:pagination.sync="pagination"
                v-bind:total-items="total"
                v-bind:loading="companiesLoading"
                v-bind:rows-per-page-items='[10,25,50]'
                v-bind:must-sort="mustSort"
                v-shortkey="{prev: ['arrowleft'], next: ['arrowright']}" @shortkey.native="paginationShortcut"    
            >
            <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
            <template slot="items" slot-scope="props">
                <td>
                    <v-btn class="text-xs-left" flat :to="{ name: 'companies-id', params: { id: props.item.id }}">
                        {{ props.item.name }}
                    </v-btn>
                </td>
                <td>
                    <template v-if="props.item.is_client">
                        Y
                    </template>
                    <template v-else>
                        N 
                    </template>
                </td>
                <td>{{props.item.status}}</td>
                <td><company-active-project-render :projects="props.item.projects" /></td>
                <td>
                    <template v-for="(project,pindex) in props.item.projects">
                        <project-role-cell-render :key="pindex+'-'+props.item.id+'-'+project.id+'-'+project.project_role_id" :project_role_id="project.project_role_id" />,
                    </template>
                </td>
            </template>
            <template slot="no-data">
                <v-alert :value="true" type="info" outline color="info" icon="info">
                    Sorry, nothing to display here :( 
                        <v-btn color="primary" @click="resetFilters">Reset filters</v-btn>
                </v-alert>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import ProjectRoleCellRender from '~/components/Project/ProjectRoleCellRender.vue';
    import CompanyActiveProjectRender from '~/components/Company/CompanyActiveProjectRender.vue';

    
    export default {
        components: {ProjectRoleCellRender,CompanyActiveProjectRender},
        data: () => ({
            mustSort:true,
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    sortable: true,
                    value: 'name'
                },
                {
                    text: 'Client?',
                    align: 'left',
                    sortable: true,
                },
                {
                    text: 'Status',
                    align: 'left',
                    sortable: true,
                },
                {
                    text: 'Active Projects',
                    align: 'left',
                    sortable: true,
                },
                {
                    text: 'Roles',
                    align: 'left',
                    sortable: true,
                },

            ]
        }),
        computed: {
            ...mapGetters('company_list',['companiesLoading','companies','total']),

            pagination: {
                get() { return this.$store.getters['company_list/pagination']},
                set(val) {this.$store.commit('company_list/pagination',val)}
            },
            // BUG work-around https://github.com/vuetifyjs/vuetify/issues/3585
            params() {
                let p = this.$store.getters['company_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,
                    q: this.$store.getters['company_list/search'],                
                };
            },
        },

        watch: {            
            params (val,oldVal) {
                delete val.totalItems
                delete oldVal.totalItems
                if(JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$store.dispatch('company_list/fetchCompanies')
                }
            }, 

        },

        methods: {
            resetFilters() {
                this.$store.commit('company_list/resetFilters')
            },
            paginationShortcut(event) {
                switch(event.srcKey) {
                    case 'prev':
                        this.$store.commit('company_list/paginationPrev')
                        break;
                    case 'next':
                        this.$store.commit('company_list/paginationNext')
                        break;
                }
            }
        }
    }
</script>