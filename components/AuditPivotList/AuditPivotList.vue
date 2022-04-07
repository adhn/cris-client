<template>
    <v-data-table
            v-bind:headers="headers"
            v-bind:items="auditPivots"
            v-bind:pagination.sync="pagination"
            v-bind:total-items="total"
            v-bind:loading="auditPivotsLoading"
            v-bind:rows-per-page-items='[10,25,50]'
            v-bind:must-sort="false"
    >
        <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
        <template slot="items" slot-scope="props">
            <td>
                <template v-if="props.item.user">
                    {{props.item.user.name}}
                </template>
                <template v-else>
                    System
                </template>
            </td>
            <td>{{props.item.event}}</td>
            <td>
                <type-link-render :item="props.item" />
            </td>
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
    import TypeLinkRender from '~/components/AuditPivotList/TypeLinkRender.vue'
    export default {
        components: {TypeLinkRender},
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
                    text: 'Auditable',
                    align: 'left',
                    sortable: false,
                    value: 'auditable_type',
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
            ...mapGetters('audit_pivot_list',['auditPivotsLoading','auditPivots','total']),

            pagination: {
                get() { return this.$store.getters['audit_pivot_list/pagination']},
                set(val) {this.$store.commit('audit_pivot_list/pagination',val)}
            },
            params() {
                let p = this.$store.getters['audit_pivot_list/pagination'];
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
                    this.$store.dispatch('audit_pivot_list/fetchAuditPivots')
                }
            }

        },

        methods: {
            resetFilters() {
                this.$store.commit('audit_pivot_list/resetFilters')
            }
        }
    }
</script>