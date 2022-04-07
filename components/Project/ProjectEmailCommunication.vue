<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Project Email Communication</h3>
                        <v-btn flat :to="{ name: 'emailfeeds'}"><v-icon>open_in_new</v-icon></v-btn>
                        <v-spacer />
                        <v-flex pl-3 xs3>
                            <v-text-field
                                    append-icon="search"
                                    label="Search"
                                    v-model="search"
                                    :clearable="true"
                            ></v-text-field>
                        </v-flex>
                    </v-card-title>
                    <v-card-text>
                        <MessageList ref="projectMessages" class="" :storeName="'message_list'" key="main" :displayAutoSuggestions="false">
                        </MessageList>                        
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    // import { createNamespacedHelpers } from 'vuex'

    import {mapGetters} from 'vuex';
    import MessageList from '~/components/MessageList/MessageList.vue';
    
    export default {
        props: ['projectId'],
        components: {
            MessageList
        },
        data: () => ({
            storeName: 'message_list'
        }),
        methods: {
            refetchMessages() {
                this.$store.dispatch(this.storeName+'/fetchMessages')
            },
        },
        computed: {
            ...mapGetters('project',['project']),            
            search: {
                get() { return this.$store.getters[this.storeName+'/search']},
                set(val) {this.$store.commit(this.storeName+'/search',val)}
            },
        },
        watch: {
            search(val,oldVal) {
                if(val) {
                    if(oldVal) {
                        if(val.length < oldVal.length) {
                            this.refetchMessages()
                        }
                    }
                    if(val.length > 2) {
                        this.refetchMessages()
                    }
                } else {
                    this.refetchMessages()
                }
            }
        },
        mounted: function() {
            // message list related stuff 
            this.$store.commit('message_list/resetFilters')
            this.$store.commit('message_list/selectedProjects',[parseInt(this.$store.getters['project/id'])])
            this.$store.dispatch('message_list/fetchMessages')
            this.$store.dispatch('message_list/fetchCompaniesAndProjects')
        }
    }
</script>