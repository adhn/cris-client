<template>
    <div>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="contacts"
                v-bind:pagination.sync="pagination"
                v-bind:total-items="total"
                v-bind:loading="contactsLoading"
                v-bind:rows-per-page-items='[10,25,50]'
                v-bind:must-sort=mustSort
                v-shortkey="{prev: ['arrowleft'], next: ['arrowright']}" @shortkey.native="paginationShortcut"    

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
                <td><CompaniesCellRender :item=props.item /></td>
                <td><ProjectsCellRender :item=props.item /></td>
                <td class="justify-center layout px-0">
                    <ActionEditDelete :item=props.item></ActionEditDelete>
                    <ActionDeduplicate :item=props.item></ActionDeduplicate>
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
    import ActionDeduplicate from '~/components/ContactList/ActionDeduplicate.vue' 
    import ActionEditDelete from '~/components/ContactList/ActionEditDelete.vue'
    import PhonesCellRender from '~/components/ContactList/PhonesCellRender.vue'
    import EmailCellRender from '~/components/ContactList/EmailCellRender.vue'
    import CompaniesCellRender from '~/components/ContactList/CompaniesCellRender.vue'
    import ProjectsCellRender from '~/components/ContactList/ProjectsCellRender.vue'
    
    export default {
        components: {ActionDeduplicate,ActionEditDelete,PhonesCellRender,EmailCellRender,CompaniesCellRender,ProjectsCellRender},
        data: () => ({
            mustSort:true,
            headers: [
                {
                    text: 'Full name',
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
                {text: 'Companies', value: ''},
                {text: 'Projects', value: ''},
                {text: 'Actions', value: '', sortable: false}
            ]
        }),
        computed: {
            ...mapGetters('contact_list',['contactsLoading','contacts','total']),

            pagination: {
                get() { return this.$store.getters['contact_list/pagination']},
                set(val) {this.$store.commit('contact_list/pagination',val)}
            },
            // BUG work-around https://github.com/vuetifyjs/vuetify/issues/3585
            params() {
                let p = this.$store.getters['contact_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,
                    companies: this.$store.getters['contact_list/selectedCompanies'],
                    projects: this.$store.getters['contact_list/selectedProjects'],
                    q: this.$store.getters['contact_list/search'],                
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

        methods: {
            resetFilters() {
                this.$store.commit('contact_list/resetFilters')
            },
            paginationShortcut(event) {
                switch(event.srcKey) {
                    case 'prev':
                        this.$store.commit('contact_list/paginationPrev')
                        break;
                    case 'next':
                        this.$store.commit('contact_list/paginationNext')
                        break;
                }
            }

        }
    }
</script>