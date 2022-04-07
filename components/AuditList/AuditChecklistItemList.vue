<template>
    <v-data-table
            v-bind:headers="headers"
            v-bind:items="audits"
            v-bind:pagination.sync="pagination"
            v-bind:total-items="total"
            v-bind:loading="auditsLoading"
            v-bind:rows-per-page-items='[10,25,50]'
            v-bind:must-sort="false"
    >
        <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
        <template slot="items" slot-scope="props">
            <td>{{props.item.user.name}}</td>
            <td>{{props.item.event}}</td>
            <td>{{props.item.old_values}}</td>
            <td>{{props.item.new_values}}</td>
            <td>{{props.item.created_at | moment('timezone', tz, 'LLLL') }}</td>
        </template>
        <template slot="no-data">
            <v-alert :value="true" type="info" outline color="info" icon="info">
                Sorry, nothing to display here :( 
            </v-alert>
        </template>
    </v-data-table>
</template>

<script>
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    
    export default {
        components: {},
        data: () => ({
            headers: [
                {
                    text: 'User',
                    align: 'left',
                    sortable: false,
                    value: 'user',
                },
                {
                    text: 'Action',
                    align: 'left',
                    sortable: false,
                    value: 'event',
                },
                {
                    text: 'Before',
                    align: 'left',
                    sortable: false,
                    width: '40%'

                },
                {
                    text: 'After',
                    align: 'left',
                    sortable: false,
                    width: '40%'                    
                },
                {
                    text: 'Date',
                    value: 'created_at',
                    align: 'left',
                    sortable:true
                },
            ],
            tz: moment.tz.guess()
        }),
        computed: {
            ...mapGetters('audit_checklist_item_list',['auditsLoading','audits','total']),

            pagination: {
                get() { return this.$store.getters['audit_checklist_item_list/pagination']},
                set(val) {this.$store.commit('audit_checklist_item_list/pagination',val)}
            },
            params() {
                let p = this.$store.getters['audit_checklist_item_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,             
                };
            }
        },

        watch: {            
            params (val,oldVal) {
                delete val.totalItems
                delete oldVal.totalItems
                if(JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$store.dispatch('audit_checklist_item_list/fetchAudits')
                }
            }

        },

        methods: {
            resetFilters() {
                this.$store.commit('audit_checklist_item_list/resetFilters')
            }
        }
    }
</script>