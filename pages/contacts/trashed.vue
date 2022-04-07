<template>
    <v-data-table
            v-bind:headers="headers"
            v-bind:items="trashedContacts"
            v-bind:pagination.sync="pagination"
            v-bind:total-items="total"
            v-bind:loading="contactsLoading"
            v-bind:rows-per-page-items='[10,25,50]'
            v-bind:must-sort=mustSort
    >
        <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
        <template slot="items" slot-scope="props">
            <td>{{ props.item.display_name }}</td>
            <td>{{ props.item.job_title }}</td>
            <td><phones-cell-render :item=props.item /></td>
            <td><email-cell-render :item=props.item /></td>
            <td><companies-cell-render :item=props.item /></td>
            <td><projects-cell-render :item=props.item /></td>
            <td class="justify-center layout px-0">
                <v-btn icon class="mx-0" @click="restoreItem(props.item)">
                    <v-icon color="teal">restore</v-icon>
                </v-btn>
            </td>
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
    import PhonesCellRender from '~/components/ContactList/PhonesCellRender.vue'
    import EmailCellRender from '~/components/ContactList/EmailCellRender.vue'
    import CompaniesCellRender from '~/components/ContactList/CompaniesCellRender.vue'
    import ProjectsCellRender from '~/components/ContactList/ProjectsCellRender.vue'
    export default {
        components: {PhonesCellRender,EmailCellRender,CompaniesCellRender,ProjectsCellRender },
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
        async fetch ({ store, params,redirect }) {
            if (!store.getters['auth/isAdmin']) {
                return redirect('/contacts')
            }
            return store.dispatch('contact_list_trashed/fetchTrashed')
        },
        computed: {
            ...mapGetters('contact_list_trashed',['trashedContacts','total','contactsLoading']),
            pagination: {
                get() { return this.$store.getters['contact_list_trashed/pagination'] },
                set(val) { this.$store.commit('contact_list_trashed/pagination',val) }
            }
        },
        methods: {
            async restoreItem(item) {
                return this.$store.dispatch('contact_list_trashed/restoreContact',item)
            }
        }
    }
</script>