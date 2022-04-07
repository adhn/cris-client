<template>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="checklistTemplates"
                v-bind:pagination.sync="pagination"
                v-bind:total-items="total"
                v-bind:loading="loading"
                v-bind:rows-per-page-items='[10,25,50]'
                v-bind:must-sort=mustSort
        >
            <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
            <template slot="items" slot-scope="props">
                <td>
                    <v-btn flat :to="{ name: 'settings-checklistTemplates-edit-id', params: { id: props.item.id }}">
                        {{ props.item.name }}
                    </v-btn>
                </td>
            </template>
            <template slot="no-data">
                <v-alert :value="true" type="info" outline color="info" icon="info">
                    Sorry, nothing to display here :( 
                        <v-btn color="primary" @click="resetFilters">Reset filters</v-btn>
                </v-alert>
                
            </template>
        </v-data-table>
</template>

<script>
    import {mapGetters} from 'vuex';

    
    export default {
        components: {},
        data: () => ({
            mustSort:true,
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    sortable: true,
                    value: 'name'
                },
            ]
        }),
        computed: {
            ...mapGetters('checklist_template_list',['loading','checklistTemplates','total']),

            pagination: {
                get() { return this.$store.getters['checklist_template_list/pagination']},
                set(val) {this.$store.commit('checklist_template_list/pagination',val)}
            },
            // BUG work-around https://github.com/vuetifyjs/vuetify/issues/3585
            params() {
                let p = this.$store.getters['checklist_template_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,
                    q: this.$store.getters['checklist_template_list/search'],                
                };
            },
        },

        watch: {            
            params (val,oldVal) {
                delete val.totalItems
                delete oldVal.totalItems
                if(JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$store.dispatch('checklist_template_list/fetchChecklistTemplates')
                }
            }, 

        },

        methods: {
            resetFilters() {
                this.$store.commit('checklist_template_list/resetFilters')
            },

        }
    }
</script>