<template>
    <v-data-table
        :headers="headers"
        :items="interactions"
        :pagination.sync="pagination"
        :total-items="total"
        :loading="interactionsLoading"
        :rows-per-page-items='[10,25,50]'
        :must-sort="false"
        v-shortkey="{prev: ['arrowleft'], next: ['arrowright']}" @shortkey.native="paginationShortcut"    
    >
        <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
        <template slot="items" slot-scope="props">
            <td><router-link :to="{ name: 'interactions-edit-id', params: { id: props.item.id }}">{{props.item.title}}</router-link></td>
            <td>{{props.item.interactionType.name}}</td>
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
                    text: 'Title',
                    align: 'left',
                    sortable: true,
                    value: 'title',
                    width: '80%'
                },
                {
                    text: 'Type',
                    align: 'left',
                    sortable: false,
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
            ...mapGetters('interaction_list',['interactionsLoading','interactions','total']),

            pagination: {
                get() { return this.$store.getters['interaction_list/pagination']},
                set(val) {this.$store.commit('interaction_list/pagination',val)}
            },
            params() {
                let p = this.$store.getters['interaction_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,             
                };
            },
        },

        watch: {            
            params (val,oldVal) {
                delete val.totalItems
                delete oldVal.totalItems
                if(JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$store.dispatch('interaction_list/fetchInteractions')
                }
            },

        },
        methods: {
            resetFilters() {
                this.$store.commit('interaction_list/resetFilters')
            },
            paginationShortcut(event) {
                switch(event.srcKey) {
                    case 'prev':
                        this.$store.commit('interaction_list/paginationPrev')
                        break;
                    case 'next':
                        this.$store.commit('interaction_list/paginationNext')
                        break;
                }
            }
        }
    }
</script>