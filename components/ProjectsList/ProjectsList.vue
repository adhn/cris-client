<template>
    <div>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="projects"
                v-bind:pagination.sync="pagination"
                v-bind:total-items="total"
                v-bind:loading="projectsLoading"
                v-bind:rows-per-page-items='[10,25,50]'
                v-bind:must-sort=mustSort
                v-shortkey="{prev: ['arrowleft'], next: ['arrowright']}" @shortkey.native="paginationShortcut"    

        >
            <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
            <template slot="items" slot-scope="props">
                <td>
                    <v-btn flat class="text-xs-left" :to="{ name: 'projects-id', params: { id: props.item.id }}">
                        {{ props.item.name }}
                    </v-btn>
                </td>
                <td>
                    <template v-if="props.item.issuerCompany">
                        <router-link :key="'company-'+props.item.issuerCompany.id" :to="{ name: 'companies-id', params: { id: props.item.issuerCompany.id }}">
                            {{props.item.issuerCompany.name}}
                        </router-link>
                    </template>
                    
                </td>
                <td>
                    <template v-if="props.item.active">
                        Active
                    </template>
                    <template v-else>
                        Archived
                    </template>
                </td>

                <td :class="determineRowColor(props.item.action_date)">
                    {{props.item.action_date | iso-8601-date-to-european-format}} 
                </td>

                <td>
                    {{props.item.progress_total-props.item.progress_todo}}/{{props.item.progress_total}}
                    <checklist-progress :total="props.item.progress_total" :todo="props.item.progress_todo" />
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
    import moment from 'moment'
    import ChecklistProgress from '~/components/Checklist/ChecklistProgress.vue'

    export default {
        components: {ChecklistProgress},
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
                    text: 'Issuer',
                    align: 'left',
                    sortable: true,
                    value: 'issuerCompany.name'
                },
                {
                    text: 'Active',
                    value: 'active',
                    align: 'left'
                },
                {
                    text: 'Action date',
                    align: 'left',
                    sortable: true,
                    value: 'action_date'
                },
                {text: 'Open checklist items', value: 'progress_todo', sortable: true}
            ]
        }),
        computed: {
            ...mapGetters('project_list',['projectsLoading','projects','total']),

            pagination: {
                get() { return this.$store.getters['project_list/pagination']},
                set(val) {this.$store.commit('project_list/pagination',val)}
            },
            // BUG work-around https://github.com/vuetifyjs/vuetify/issues/3585
            params() {
                let p = this.$store.getters['project_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,
                    q: this.$store.getters['project_list/search'],                
                };
            },
        },

        watch: {            
            params (val,oldVal) {
                delete val.totalItems
                delete oldVal.totalItems
                if(JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$store.dispatch('project_list/fetchProjects')
                }
            }, 

        },

        methods: {
            resetFilters() {
                this.$store.commit('project_list/resetFilters')
            },
            determineRowColor(action_date) {
                if(action_date) {
                    let actionDate = moment(action_date).utc(true);
                    let nowDate = moment().utc(true);
                    if(nowDate >= actionDate) {
                        return 'red--text accent-2 font-weight-bold'
                        // return '#FF5252'
                    }

                    let inAWeek = moment().utc(true).add(1, 'week')
                    if(actionDate <= inAWeek) {
                        // return 'yellow lighten-1'
                    return 'amber--text font-weight-bold'

                    }
                }
            },
            paginationShortcut(event) {
                switch(event.srcKey) {
                    case 'prev':
                        this.$store.commit('project_list/paginationPrev')
                        break;
                    case 'next':
                        this.$store.commit('project_list/paginationNext')
                        break;
                }
            }

        }
    }
</script>