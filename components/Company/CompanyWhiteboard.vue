<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Whiteboard</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs4>
                                <v-textarea
                                outline
                                name="whiteboard_1"
                                label=""
                                v-model="whiteboard_1"
                                :success-messages="whiteboard_1_message"
                                ></v-textarea>
                            </v-flex>
                            <v-flex xs4 pl-1>
                                <v-textarea
                                outline
                                name="whiteboard_2"
                                label=""
                                v-model="whiteboard_2"
                                :success-messages="whiteboard_2_message"
                                ></v-textarea>
                            </v-flex>
                            <v-flex xs4 pl-1>
                                <v-textarea
                                outline
                                name="whiteboard_3"
                                label=""
                                v-model="whiteboard_3"
                                :success-messages="whiteboard_3_message"
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    
    export default {
        props: [],
        components: {
        },
        data: () => ({

        }),
        methods: {

        },
        computed: {
            ...mapGetters('company',['whiteboard_1_message','whiteboard_2_message','whiteboard_3_message']),
            whiteboard_1: {
                get () { return this.$store.getters['company/whiteboard_1'] },
                set (value) { this.$store.dispatch('company/delayed_whiteboard_autosave',{
                    field: 'whiteboard_1',
                    value: value
                }) }
            },
            whiteboard_2: {
                get () { return this.$store.getters['company/whiteboard_2'] },
                set (value) { this.$store.dispatch('company/delayed_whiteboard_autosave',{
                    field: 'whiteboard_2',
                    value: value
                }) }
            },
            whiteboard_3: {
                get () { return this.$store.getters['company/whiteboard_3'] },
                set (value) { this.$store.dispatch('company/delayed_whiteboard_autosave',{
                    field: 'whiteboard_3',
                    value: value
                }) }
            },
        },
        watch: {
            timeouts(val,oldVal) {
                console.info('timeouts',val,oldVal)
            }
        },
        mounted: function() {

        }
    }
</script>
