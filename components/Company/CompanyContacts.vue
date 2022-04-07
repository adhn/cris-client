<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Contacts</h3>
                        
                        <v-spacer />
                        <v-btn flat :to="{ name: 'contacts'}"><v-icon>open_in_new</v-icon></v-btn>
                        <company-contacts-attach-dialog />
                        <company-contacts-new-dialog />                        
                    </v-card-title>
                    <v-card-text>
                        <v-data-table
                                v-bind:headers="headers"
                                v-bind:items="contacts"
                                v-bind:pagination.sync="pagination"
                                v-bind:total-items="total"
                                v-bind:loading="contactsLoading"
                                v-bind:rows-per-page-items='[10,25,50]'
                                v-bind:must-sort="mustSort"
                        >
                            <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
                            <template slot="items" slot-scope="props">
                                <td>
                                    <v-btn flat :to="{ name: 'contacts-id', params: { id: props.item.id }}">
                                        {{ props.item.display_name }}
                                    </v-btn>
                                </td>
                                <td>{{ props.item.job_title }}</td>
                                <td><PhonesCellRender :item=props.item /></td>
                                <td><EmailCellRender :item=props.item /></td>
                            </template>
                            <template slot="no-data">
                                <v-alert :value="true" type="info" outline color="info" icon="info">
                                    Sorry, nothing to display here :( 
                                </v-alert>
                                
                            </template>
                        </v-data-table>
                        <v-layout row wrap align-start="">

                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import PhonesCellRender from '~/components/ContactList/PhonesCellRender.vue'
    import EmailCellRender from '~/components/ContactList/EmailCellRender.vue'
    import ProjectRoleCellRender from '~/components/Project/ProjectRoleCellRender.vue'
    
    import CompanyContactsAttachDialog from '~/components/Company/CompanyContactsAttachDialog.vue'
    import CompanyContactsNewDialog from '~/components/Company/CompanyContactsNewDialog.vue'

    export default {
        props: ['projectId'],
        components: {
            PhonesCellRender,
            EmailCellRender,
            ProjectRoleCellRender,
            CompanyContactsAttachDialog,
            CompanyContactsNewDialog
        },
        data: () => ({
            mustSort:true,
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    sortable: true,
                    value: 'display_name'
                },
                {
                    text: 'Position',
                    value: 'job_title',
                    align: 'left'
                },
                {text: 'Phones', sortable: false, value: 'business_phones'},
                {text: 'Email address', value: 'email_addresses', sortable: false},
            ]
        }),
        methods: {

        },
        computed: {
            ...mapGetters('contact_list',['contactsLoading','contacts','total']),
            pagination: {
                get() { return this.$store.getters['contact_list/pagination']},
                set(val) {this.$store.commit('contact_list/pagination',val)}
            },
            params() {
                let p = this.$store.getters['contact_list/pagination'];
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
                    this.$store.dispatch('contact_list/fetchData')
                }
            },
        },
        mounted: function() {
        }
    }
</script>
