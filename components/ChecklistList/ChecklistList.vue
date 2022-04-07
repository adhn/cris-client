<template>
    <div>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="checklists"
                v-bind:pagination.sync="pagination"
                v-bind:total-items="total"
                v-bind:loading="loading"
                v-bind:rows-per-page-items='[10,25,50]'
        >
            <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
            <template slot="items" slot-scope="props">
                <tr>
                    <td>
                        <!-- <router-link :to="{ name: 'checklists-id', params: { id: props.item.id }}">
                            {{ props.item.name }}
                        </router-link> -->
                        <project-checklist-edit-dialog :key="'project-checklist-edit-dialog-'+props.item.id" :checklistId="props.item.id" :checklistName="props.item.name" />
                    </td>
                    <td>
                            {{props.item.status | toTitleCase}}
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
    import ProjectChecklistEditDialog from '~/components/Project/ProjectChecklistEditDialog.vue'
    import moment from 'moment'
    export default {
        components: {ChecklistProgress,ProjectChecklistEditDialog},
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
                    text: 'Status',
                    align: 'left',
                    sortable: true,
                    value: 'status'
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
                    value: 'progress_todo',
                    sortable: false,
                },
            ]
        }),
        computed: {
            ...mapGetters('checklist_list',['loading','checklists','total']),

            pagination: {
                get() { return this.$store.getters['checklist_list/pagination']},
                set(val) {this.$store.commit('checklist_list/pagination',val)}
            },
            // BUG work-around https://github.com/vuetifyjs/vuetify/issues/3585
            params() {
                let p = this.$store.getters['checklist_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,
                    q: this.$store.getters['checklist_list/search'],                
                };
            },
        },

        watch: {            
            params (val,oldVal) {
                delete val.totalItems
                delete oldVal.totalItems
                if(JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$store.dispatch('checklist_list/fetchChecklists')
                }
            }, 

        },

        methods: {
            resetFilters() {
                this.$store.commit('checklist_list/resetFilters')
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
            }
        }
    }
</script>