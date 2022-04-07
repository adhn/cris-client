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
                    <td><router-link :to="{ name: 'interactions-edit-id', params: { id: props.item.id }}">{{props.item.title}}</router-link></td>
                    <td>{{props.item.interactionType.name}}</td>
                    <td>{{props.item.created_at | moment('timezone', tz, 'LLLL') }}</td>
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
    import moment from 'moment';
    export default {
        components: { },
        data: () => ({
            mustSort:true,
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
                {
                    text: 'Action',
                    align: 'left',
                    sortable: false,
                },


            ],
            tz: moment.tz.guess()
        }),
        async fetch ({ store, params,redirect }) {
            if (!store.getters['auth/isAdmin']) {
                return redirect('/interactions')
            }
            return store.dispatch('interaction_list_trashed/fetch')
        },
        computed: {
            ...mapGetters('interaction_list_trashed',['trashedItems','total','loading']),
            pagination: {
                get() { return this.$store.getters['interaction_list_trashed/pagination'] },
                set(val) { this.$store.commit('interaction_list_trashed/pagination',val) }
            }
        },
        methods: {
            async restoreItem(item) {
                return this.$store.dispatch('interaction_list_trashed/restore',item)
            }
        }
    }
</script>