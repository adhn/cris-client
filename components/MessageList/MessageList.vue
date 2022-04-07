<template>
<div>
    <slot></slot>
    <v-layout row mb-3>
        <v-flex xs12>
            <v-data-table
                    v-bind:headers="headers"
                    v-bind:items="messages"
                    v-bind:pagination.sync="pagination"
                    v-bind:total-items="total"
                    v-bind:loading="messagesLoading"
                    v-bind:rows-per-page-items='[10,25,50]'
                    v-bind:must-sort=mustSort
                    v-shortkey="{prev: ['arrowleft'], next: ['arrowright']}" @shortkey.native="paginationShortcut"    

            >
                <!-- TODO: To enable server-side search to work don't pass the search prop to v-data-table -->
                <template slot="items" slot-scope="props">
                <tr>
                    <td>
                        <from-cell-render :key="'from-'+props.item.id" :message="props.item" />
                    </td>
                    <td>
                        <to-cell-render :key="'to-'+props.item.id" :contactObjects="props.item.contact_to_recipients" :contactStrings="props.item.to_recipients" />
                        <to-cell-render :key="'cc-'+props.item.id" :contactObjects="props.item.contact_cc_recipients" :contactStrings="props.item.cc_recipients" />
                    </td>
                    <td>
                        <template v-if="props.item.attachments.length > 0">
                            <v-icon>attach_file</v-icon>
                        </template>
                    </td>
                    <td @click="openDialog(props.item.id)">{{ props.item.subject }}</td>
                    <td @click="openDialog(props.item.id)">
                        <EmailReplyTextExcerptRender :key="'email-reply-'+props.item.id" :htmlBody="props.item.body_content" />
                        <!-- message dialog can live anywhere inside the tr? -->
                        <message-modal-dialog :key="'dialog-'+props.item.id" :dialog.sync="dialog" :message="props.item" :ref="'dialog'+props.item.id" /> 
                    </td>
                    <!-- <td>
                        <template v-if="props.item.weblink">
                            <v-btn icon class="mx-0" target="_blank" color="primary" :href="props.item.weblink"><v-icon>open_in_new</v-icon></v-btn> 
                        </template>
                        <template v-else>
                            <message-modal-dialog :message="props.item" />   
                        </template>
                    </td> -->
                    <td>
                        <!-- <v-btn flat :to="{ name: 'messages-id', params: { id: props.item.id }}"></v-btn> -->
                        <CategoriesAutoCompleteRender :key="'cat-auto-complete-'+props.item.id" :items="categories" :displayAutoSuggestions="displayAutoSuggestions" :message="props.item" :storeName="storeName" />
                    </td>
                    <td>
                        <timeago :key="'timeago-'+props.item.id" :datetime="props.item.created_date_time"></timeago>
                    </td>
                </tr>
                </template>
                <template slot="no-data">
                    <v-alert :value="true" type="info" outline color="info" icon="info">
                        Sorry, nothing to display here :( 
                        <v-btn color="primary" @click="resetFilters">Reset filters</v-btn>
                    </v-alert>
                </template>
            </v-data-table>
        </v-flex>
        <v-spacer />
    </v-layout>
</div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import EmailReplyTextExcerptRender from '~/components/MessageList/EmailReplyTextExcerptRender.vue'
    import FromCellRender from '~/components/MessageList/FromCellRender.vue'
    import ToCellRender from '~/components/MessageList/ToCellRender.vue'
    import CategoriesAutoCompleteRender from '~/components/MessageList/CategoriesAutoCompleteRender.vue'
    import MessageModalDialog from '~/components/Message/MessageModalDialog.vue';

    export default {
        props: ['storeName','displayAutoSuggestions'],
        components: {EmailReplyTextExcerptRender,CategoriesAutoCompleteRender,FromCellRender,ToCellRender,MessageModalDialog},
        data: () => ({
            dialog: false,
            mustSort:true,
            headers: [
                {
                    text: 'From',
                    align: 'left',
                    sortable: true,
                    value: 'from',
                },
                {
                    text: 'To/CC',
                    align: 'left',
                    sortable: false,
                },
                {sortable: false},
                {text: 'Subject', sortable: false, value: 'subject',align:'left'},
                {text: 'Abstract', sortable: false,align:'left'},
                {text: 'Categories', sortable: false,align:'left'},
                {text: 'When', sortable: true,align:'left',value:'created_date_time'},
            ]
        }),
        created: function () {
            // console.info(this.storeName)
        },
        computed: {
            // ...mapGetters('user_inbox_messages',['messages','messagesLoading','total','categories']),
            // mapgetters namespace MUST be a string, or mapgetters is done with an object
            // https://github.com/vuejs/vuex/issues/863
            // https://github.com/vuejs/vuex/pull/924
            messages() { return this.$store.getters['message_list/messages'] },
            messagesLoading() { return this.$store.getters['message_list/messagesLoading'] },
            total() { return this.$store.getters['message_list/total'] },
            categories() { return this.$store.getters['message_list/categories'] },

            pagination: {
                get() { return this.$store.getters['message_list/pagination']},
                set(val) {this.$store.commit('message_list/pagination',val)}
            },
            // BUG work-around https://github.com/vuetifyjs/vuetify/issues/3585
            params() {
                let p = this.$store.getters['message_list/pagination'];
                return {
                    page: p.page,
                    perPage: p.rowsPerPage,
                    sortBy: p.sortBy,
                    sortDesc: p.descending,
                    // q: this.$store.getters['contact_list/search'],                
                };
            },
        },

        watch: {            
            params (val,oldVal) {
                delete val.totalItems
                delete oldVal.totalItems
                if(JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$store.dispatch('message_list/fetchMessages')
                }
            }, 

        },

        methods: {
            save() {
                console.info('saving')
            },
            resetFilters() {
                this.$store.commit('message_list/resetFilters')
            },
            openDialog(id) {
                this.$refs['dialog'+id].dialogMutateable = true
            },
            paginationShortcut(event) {
                switch(event.srcKey) {
                    case 'prev':
                        this.$store.commit('message_list/paginationPrev')
                        break;
                    case 'next':
                        this.$store.commit('message_list/paginationNext')
                        break;
                }
            }
        }
    }
</script>