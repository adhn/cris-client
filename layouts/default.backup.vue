<template>
    <div id="app">
        <v-app>
            <v-container fluid>
                <v-toolbar app>
                    <v-toolbar-items>
                            <v-btn :to="{ name: 'index' }" flat >
                                <v-icon left>dashboard</v-icon>
                                Dashboard
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn :to="{ name: 'companies',query:{reset:true} }" flat>Companies</v-btn>                            
                            <v-btn :to="{ name: 'projects',query:{reset:true} }" flat>Projects</v-btn>
                            <v-btn :to="{ name: 'contacts',query:{reset:true} }" flat >Contacts</v-btn>
                            <v-btn :to="{ name: 'events',query:{reset:true} }" flat >Events</v-btn>
                            <v-btn :to="{ name: 'interactions',query:{reset:true} }" flat >Interactions</v-btn>
                            <v-btn :to="{ name: 'notes',query:{reset:true} }" flat >Notes</v-btn>
                            <v-btn :to="{ name: 'emailfeeds',query:{reset:true} }" flat >
                                <!-- <v-badge color="red" right >
                                    <template v-if="total > 0">
                                        <span slot="badge">{{total}}</span>
                                    </template>
                                        Email feed
                                </v-badge> -->
                                Email feed
                            </v-btn>
                            <v-spacer></v-spacer>
    
                        <v-btn :to="{ name: 'settings' }" flat >
                            <v-icon left>settings</v-icon>
                            Settings
                        </v-btn>

                        <template v-if="loggedIn">
                            <v-btn :to="{ name: 'logout'}" flat>Logout</v-btn>
                        </template>
                    </v-toolbar-items>
                </v-toolbar>
                <v-content>
                    <nuxt/>
                </v-content>
                <!-- <v-footer app></v-footer> -->
            </v-container>
            <feedback-snackbar></feedback-snackbar>
            <loading />
        </v-app>
    </div>
</template>

<script>
    import FeedbackSnackbar from '~/components/FeedbackSnackbar'
    import Loading from '~/components/Loading'
    import {mapGetters} from 'vuex';
    
    export default {
        components: {
            FeedbackSnackbar,
            Loading
        },
        data: () => ({
            visible: false
        }),
        computed: {
            // ...mapGetters('uncategorized_messages_count',['total']),
            user() {
                return this.$store.getters['auth/user']
            },
            loggedIn() {
                this.user ? true : false
            },
        },
        created() {
            // console.info('layouts/default')
            // this.$store.dispatch('uncategorized_messages_count/fetchUncategorizedMessagesCount')
        },
        mounted() {
            this.$nextTick(function() {
                window.addEventListener("focus", this.checkFocus);
                window.addEventListener("blur", this.checkFocus);

                this.checkFocus()
            })
        },
        methods: {
            checkFocus() {
                this.visible = document.hasFocus()
            }
        },
        watch: {
            visible(val) {
                // console.info('app visible?',val)
                this.$store.commit('visibility/visible',val)
            }
        }
        // fetch ({ store, params }) {
        //     console.info('layouts/default fetch')
        // }
    }
</script>
