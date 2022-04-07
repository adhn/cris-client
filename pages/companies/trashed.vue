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
                <td>
                    <template v-if="props.item.is_client">
                        Y
                    </template>
                    <template v-else>
                        N 
                    </template>
                </td>
                <td>
                    <v-btn flat :to="{ name: 'companies-id', params: { id: props.item.id }}">
                        {{ props.item.name }}
                    </v-btn>
                </td>
                <td>{{props.item.status}}</td>
                <td><company-active-project-render :projects="props.item.projects" /></td>
                <td>
                    <template v-for="(project,pindex) in props.item.projects">
                        <project-role-cell-render :key="pindex+'-'+props.item.id+'-'+project.id+'-'+project.project_role_id" :project_role_id="project.project_role_id" />,
                    </template>
                </td>
                <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="restoreItem(props.item)">
                        <v-icon color="teal">restore</v-icon>
                    </v-btn>
                </td>
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
                    text: 'Client?',
                    align: 'left',
                    sortable: true,
                },
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
                },
                {
                    text: 'Active Projects',
                    align: 'left',
                    sortable: true,
                },
                {
                    text: 'Roles',
                    align: 'left',
                    sortable: true,
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
                return redirect('/companies')
            }
            return store.dispatch('company_list_trashed/fetch')
        },
        computed: {
            ...mapGetters('company_list_trashed',['trashedItems','total','loading']),
            pagination: {
                get() { return this.$store.getters['company_list_trashed/pagination'] },
                set(val) { this.$store.commit('company_list_trashed/pagination',val) }
            }
        },
        methods: {
            async restoreItem(item) {
                return this.$store.dispatch('company_list_trashed/restore',item)
            }
        }
    }
</script>