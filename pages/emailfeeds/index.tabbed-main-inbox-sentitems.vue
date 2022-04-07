<template>
  <v-tabs
    icons-and-text
    class="elevation-5"
    v-model="tabs"
  >
    <v-tabs-slider color="primary"></v-tabs-slider>

    <v-tab href="#tab-main">
        Main
        <v-icon>mail</v-icon>
    </v-tab>

    <v-tab href="#tab-inbox">
        Your Inbox
        <v-badge color="red" right >
            <template v-if="inbox > 0">
                <span slot="badge">{{inbox}}</span>
            </template>
            <v-icon>mail</v-icon>
        </v-badge>
    </v-tab>

    <v-tab href="#tab-sentitems">
        Your Sent Items
        <v-badge color="red" right >
            <template v-if="sentitems > 0">
                <span slot="badge">{{sentitems}}</span>
            </template>
            <v-icon>reply</v-icon>
        </v-badge>
    </v-tab>


    <v-tab-item :id="'tab-main'">
        <!-- <MessageGrid :label="'Inbox'" :storeName="'user_inbox_messages'" key="inbox"></MessageGrid> -->
        <MessageList class="" :storeName="'message_list'" key="main" :displayAutoSuggestions="false">
            <advanced-message-list-filter-controls :storeName="'message_list'"></advanced-message-list-filter-controls>
        </MessageList>
    </v-tab-item>

    <v-tab-item :id="'tab-inbox'">
        <!-- <MessageGrid :label="'Inbox'" :storeName="'user_inbox_messages'" key="inbox"></MessageGrid> -->
        <MessageList class="" :storeName="'user_inbox_messages'" key="inbox" :displayAutoSuggestions="true">
            <message-list-filter-controls :storeName="'user_inbox_messages'"></message-list-filter-controls>
        </MessageList>
    </v-tab-item>


    <v-tab-item :id="'tab-sentitems'">
        <!-- <MessageGrid :label="'Sent Items'" :storeName="'user_sentitems_messages'" key="sentitems"></MessageGrid> -->
        <MessageList class="" :storeName="'user_sentitems_messages'" key="sentitems" :displayAutoSuggestions="true">
            <message-list-filter-controls :storeName="'user_sentitems_messages'"></message-list-filter-controls>
        </MessageList>
    </v-tab-item>

  </v-tabs>

        <!-- Message Table -->
        <!-- <message-list-filter-controls></message-list-filter-controls> -->
        
        <!-- <MessageList class="elevation-10" :storeName="'user_inbox_messages'" key="inbox"></MessageList> -->
        <!-- <MessageList class="elevation-10" :storeName="'user_sentitems_messages'" key="sentitems"></MessageList> -->

</template>
<script>
    import MessageList from '~/components/MessageList/MessageList.vue';
    // import MessageGrid from '~/components/MessageList/MessageGrid.vue';
    import MessageListFilterControls from '~/components/MessageList/MessageListFilterControls.vue';
    import AdvancedMessageListFilterControls from '~/components/MessageList/AdvancedMessageListFilterControls.vue';

    import {mapGetters} from 'vuex';

    export default {
        components: { MessageList,MessageListFilterControls,AdvancedMessageListFilterControls },
        data: () => ({
            tabs: null
        }),
        computed: {
            ...mapGetters('uncategorized_messages_count',['inbox','sentitems']),
        },
        fetch ({ store, params }) {
            return Promise.all([
                store.dispatch('user_inbox_messages/fetchMessages'),
                store.dispatch('user_inbox_messages/fetchCompaniesAndProjects'),
                store.dispatch('user_sentitems_messages/fetchMessages'),
                store.dispatch('user_sentitems_messages/fetchCompaniesAndProjects'),
                store.dispatch('message_list/fetchMessages'),
                store.dispatch('message_list/fetchCompaniesAndProjects')
            ])
        },
        mounted: function() {
            let project_id = this.$route.query.project

            let projects = this.$store.getters['message_list/projects']
            console.info(projects)
            
            if(project_id) {
                this.tabs = "tab-main"
                this.$store.commit('message_list/resetFilters')
                this.$store.commit('message_list/selectedProjects',[parseInt(project_id)])
            }
        },
        watch: {
            tabs: function() {
               console.info(this.tabs) 
            }
        }
    }
</script>