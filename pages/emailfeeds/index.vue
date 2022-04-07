<template>
<div>
        <advanced-message-list-filter-controls :storeName="'message_list'"></advanced-message-list-filter-controls>

        <MessageList class="elevation-10" key="main" :displayAutoSuggestions="true">
        </MessageList>

        <v-btn style="display:none" v-shortkey="['esc']" @shortkey.native="resetFilters()"></v-btn>

</div>
</template>
<script>
    import MessageList from '~/components/MessageList/MessageList.vue';
    // import MessageGrid from '~/components/MessageList/MessageGrid.vue';
    // import MessageListFilterControls from '~/components/MessageList/MessageListFilterControls.vue';
    import AdvancedMessageListFilterControls from '~/components/MessageList/AdvancedMessageListFilterControls.vue';

    import {mapGetters} from 'vuex';

    export default {
        components: { MessageList,AdvancedMessageListFilterControls },
        data: () => ({
            tabs: null
        }),
        computed: {
            ...mapGetters('uncategorized_messages_count',['inbox','sentitems']),
        },
        fetch ({ store, params }) {
            return Promise.all([
                store.dispatch('message_list/fetchMessages'),
                store.dispatch('message_list/fetchCompaniesAndProjects')
            ])
        },
        mounted: function() {

        },
        created() {

        },
        methods: {
            resetFilters() {
                this.$store.commit('message_list/resetFilters')
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // access to component instance via `vm`
                vm.resetFilters()
            })
        },
        watch: {
            '$route' (to, from) {
                if(this.$route.params.reset) {
                    this.resetFilters()
                }
            }
        }
    }
</script>