<template>
<v-container fluid grid-list-md>
    <!-- <h1>{{this.label}}</h1> -->

    <message-list-filter-controls :storeName="storeName"></message-list-filter-controls>
    <v-data-iterator
      :items="messages"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      :loading="messagesLoading"
      :must-sort="mustSort"
      content-tag="v-layout"
      row
      wrap
    >
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg3
      >
        <v-card>
            <v-card-title>
              <h4>From: {{ props.item.from }}</h4>
              <h5>Subject: {{ props.item.subject }}</h5>
              
            </v-card-title>
    
            <v-card-text>
                <p>
                    <timeago :datetime="props.item.created_date_time"></timeago>
                </p>

                <EmailReplyTextExcerptRender :htmlBody="props.item.body_content" />
            </v-card-text>

            <v-card-actions>
                <CategoriesAutoCompleteRender :items="categories" :message="props.item" :storeName="storeName" />
                <v-btn target="_blank" :href="props.item.weblink"><v-icon>open_in_new</v-icon></v-btn>
            </v-card-actions>

        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import EmailReplyTextExcerptRender from '~/components/MessageList/EmailReplyTextExcerptRender.vue'
    import CategoriesAutoCompleteRender from '~/components/MessageList/CategoriesAutoCompleteRender.vue'
    import MessageListFilterControls from '~/components/MessageList/MessageListFilterControls.vue';
    export default {
        props: ['storeName','label'],
        components: {EmailReplyTextExcerptRender,CategoriesAutoCompleteRender,MessageListFilterControls},
        data: () => ({
            mustSort:true,
            headers: [
                {
                    text: 'From',
                    align: 'left',
                    sortable: true,
                    value: 'from'
                },
                {text: 'Subject', sortable: false, value: 'subject',align:'left'},
                {},
                {}
            ],
            rowsPerPageItems: [4, 8, 12]
            // pagination: {
            //     rowsPerPage: 4
            // },
        }),
        created: function () {
            // console.info(this.storeName)
        },
        computed: {
            // ...mapGetters('user_inbox_messages',['messages','messagesLoading','total','categories']),
            // mapgetters namespace MUST be a string, or mapgetters is done with an object
            // https://github.com/vuejs/vuex/issues/863
            // https://github.com/vuejs/vuex/pull/924
            messages() { return this.$store.getters[this.storeName+'/messages'] },
            messagesLoading() { return this.$store.getters[this.storeName+'/messagesLoading'] },
            total() { return this.$store.getters[this.storeName+'/total'] },
            categories() { return this.$store.getters[this.storeName+'/categories'] },

            pagination: {
                get() { return this.$store.getters[this.storeName+'/pagination']},
                set(val) {this.$store.commit(this.storeName+'/pagination',val)}
            },
            // BUG work-around https://github.com/vuetifyjs/vuetify/issues/3585
            params() {
                let p = this.$store.getters[this.storeName+'/pagination'];
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
                    this.$store.dispatch(this.storeName+'/fetchMessages')
                }
            }, 

        },

        methods: {
            save() {
                console.info('saving')
            }

        }
    }
</script>