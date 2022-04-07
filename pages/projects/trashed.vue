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
                        <v-btn flat :to="{ name: 'projects-id', params: { id: props.item.id }}">
                            {{ props.item.name }}
                        </v-btn>
                    </td>
                    <td>
                        <router-link :key="'company-'+props.item.issuerCompany.id" :to="{ name: 'companies-id', params: { id: props.item.issuerCompany.id }}">
                            {{props.item.issuerCompany.name}}
                        </router-link>
                        
                    </td>
                    <td>
                        <template v-if="props.item.active">
                            Active
                        </template>
                        <template v-else>
                            Archived
                        </template>
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
                    text: 'Action',
                    align: 'left',
                    sortable: false,
                },


            ]
        }),
        async fetch ({ store, params,redirect }) {
            if (!store.getters['auth/isAdmin']) {
                return redirect('/projects')
            }
            return store.dispatch('project_list_trashed/fetch')
        },
        computed: {
            ...mapGetters('project_list_trashed',['trashedItems','total','loading']),
            pagination: {
                get() { return this.$store.getters['project_list_trashed/pagination'] },
                set(val) { this.$store.commit('project_list_trashed/pagination',val) }
            }
        },
        methods: {
            async restoreItem(item) {
                return this.$store.dispatch('project_list_trashed/restore',item)
            }
        }
    }
</script>