<template>
    <div id="app">
        <v-app>
                <v-navigation-drawer app v-model="drawer" :mini-variant="mini" hide-overlay stateless>
                    <v-toolbar flat class="transparent">
                        <v-list class="pa-0">
                            <v-list-tile avatar>
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-list-tile-avatar v-on="on">
                                        <img src="https://randomuser.me/api/portraits/men/85.jpg">
                                    </v-list-tile-avatar>
                                </template>
                                <span>{{user.name}}</span>
                            </v-tooltip>

                            <v-list-tile-content>
                                <v-list-tile-title>{{user.name}}</v-list-tile-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn
                                icon
                                @click.stop="mini = !mini"
                                >
                                <v-icon>chevron_left</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-toolbar>

                    <v-list class="pt-0">
                        <v-divider></v-divider>
                        <v-list-tile
                            v-for="item in items"
                            :key="item.title"
                            :to="item.to"
                        >
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-list-tile-action v-on="on">
                                        <v-icon>{{item.icon}}</v-icon>
                                    </v-list-tile-action>
                                </template>
                                <span>{{item.title}}</span>
                            </v-tooltip>
                            <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-navigation-drawer>


            <v-container fluid>
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
            visible: false,
            drawer: true,
            items: [
                { 
                    title: 'Dashboard', 
                    icon: 'dashboard',
                    to: { name: 'index' } 
                },
                {
                    title: 'Companies',
                    icon: 'account_balance',
                    to: { name: 'companies',query:{reset:true} }
                },
                {
                    title: 'Projects',
                    icon: 'assignment',
                    to: { name: 'projects',query:{reset:true} }
                },
                {   title: 'Contacts',
                    icon: 'contacts',
                    to: { name: 'contacts',query:{reset:true} }
                },
                {
                    title: 'Events',
                    icon: 'event',
                    to: { name: 'events',query:{reset:true} }
                },
                {
                    title: 'Interactions',
                    icon: 'people_outline',
                    to: { name: 'interactions',query:{reset:true} } 
                },
                {
                    title: 'Notes',
                    icon: 'note',
                    to: { name: 'notes',query:{reset:true} }
                },
                {
                    title: 'Email feed',
                    icon: 'mail_outline',
                    to: { name: 'emailfeeds',query:{reset:true} }  
                },
                {
                    title: 'Settings',
                    icon: 'settings',
                    to: { name: 'settings' }
                }
            ],
            mini: true,
            right: null
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
