<template>
    <div>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="events"
                v-bind:pagination.sync="pagination"
                v-bind:total-items="total"
                v-bind:loading="loading"
                v-bind:rows-per-page-items='[10,25,50]'
                v-shortkey="{prev: ['arrowleft'], next: ['arrowright']}" @shortkey.native="paginationShortcut"    
        >
            <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
            <template slot="items" slot-scope="props">
                <tr>
                <td>
                    <v-btn flat :to="{ name: 'events-id', params: { id: props.item.id }}">
                        {{ props.item.name }}
                    </v-btn>
                </td>
                <td>
                    <template v-if="props.item.eventType">
                        {{props.item.eventType.name}}
                    </template>
                </td>
                <td>
                        {{props.item.status | toTitleCase}}
                </td>
                <td>
                    <router-link :key="'project-'+props.item.project.id" :to="{ name: 'projects-id', params: { id: props.item.project.id }}">
                        {{props.item.project.name}}
                    </router-link>
                    
                </td>
                <td>
                    <router-link :key="'company-'+props.item.project.issuerCompany.id" :to="{ name: 'companies-id', params: { id: props.item.project.issuerCompany.id }}">
                        {{props.item.project.issuerCompany.name}}
                    </router-link>
                    
                </td>
                <td>
                    {{props.item.created_at | iso-8601-date-to-european-format}}
                </td>
                <td :class="determineRowColor(props.item.action_date)">
                    {{props.item.action_date | iso-8601-date-to-european-format}} 
                </td>
                <td>
                    {{props.item.progress_total-props.item.progress_todo}}/{{props.item.progress_total}}
                    <checklist-progress :total="props.item.progress_total" :todo="props.item.progress_todo" />
                </td>
                </tr>
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
    import ChecklistProgress from '~/components/Checklist/ChecklistProgress.vue'
    import moment from 'moment'
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
                    text: 'Type',
                    align: 'left',
                    sortable: true,
                    value: 'eventType'
                },
                {
                    text: 'Status',
                    align: 'left',
                    sortable: true,
                    value: 'status'
                },

                {
                    text: 'Project',
                    align: 'left',
                    sortable: true,
                    value: 'project'
                },
                {
                    text: 'Issuer',
                    align: 'left',
                    sortable: true,
                    value: 'project.issuerCompany.name'
                },
                {
                    text: 'Created date',
                    align: 'left',
                    sortable: true,
                    value: 'created_at'
                },
                {
                    text: 'Action date',
                    align: 'left',
                    sortable: true,
                    value: 'action_date'
                },
                                {
                    text: 'Checklist progress',
                    align: 'left',
                    sortable: false,
                },
            ]
        }),
        computed: {
            ...mapGetters('event_list',['loading','events','total']),

            pagination: {
                get() { return this.$store.getters['event_list/pagination']},
                set(val) {this.$store.commit('event_list/pagination',val)}
            },
            // BUG work-around https://github.com/vuetifyjs/vuetify/issues/3585
            params() {
                let p = this.$store.getters['event_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,
                    q: this.$store.getters['event_list/search'],                
                };
            },
        },

        watch: {            
            params (val,oldVal) {
                delete val.totalItems
                delete oldVal.totalItems
                if(JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$store.dispatch('event_list/fetchEvents')
                }
            }, 

        },

        methods: {
            resetFilters() {
                this.$store.commit('event_list/resetFilters')
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
                        this.$store.commit('event_list/paginationPrev')
                        break;
                    case 'next':
                        this.$store.commit('event_list/paginationNext')
                        break;
                }
            }
        }
    }
</script>