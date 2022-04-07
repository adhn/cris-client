<template>    
        <v-layout row mb-3>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Event Details</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <span style="white-space: pre;">{{details}}</span>
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
            ...mapGetters('event',['details']),
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
