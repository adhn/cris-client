<template>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="trashedItems"
                v-bind:pagination.sync="pagination"
                v-bind:total-items="total"
                v-bind:loading="loading"
                v-bind:rows-per-page-items='[10,25,50]'
                v-bind:must-sort=mustSort
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
                <td>
                    {{props.item.action_date | iso-8601-date-to-european-format}} 
                </td>
                <td>
                    {{props.item.progress_total-props.item.progress_todo}}/{{props.item.progress_total}}
                    <checklist-progress :total="props.item.progress_total" :todo="props.item.progress_todo" />
                </td>
                <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="restoreItem(props.item)">
                        <v-icon color="teal">restore</v-icon>
                    </v-btn>
                </td>
                </tr>
            </template>
        </v-data-table>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        components: { },
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
                {
                    text: 'Action',
                    align: 'left',
                    sortable: false,
                },


            ]
        }),
        async fetch ({ store, params,redirect }) {
            if (!store.getters['auth/isAdmin']) {
                return redirect('/events')
            }
            return store.dispatch('event_list_trashed/fetch')
        },
        computed: {
            ...mapGetters('event_list_trashed',['trashedItems','total','loading']),
            pagination: {
                get() { return this.$store.getters['event_list_trashed/pagination'] },
                set(val) { this.$store.commit('event_list_trashed/pagination',val) }
            }
        },
        methods: {
            async restoreItem(item) {
                return this.$store.dispatch('event_list_trashed/restore',item)
            }
        }
    }
</script>