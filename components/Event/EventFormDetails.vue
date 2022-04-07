<template>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <h3>Details</h3>
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs12>
                                <v-textarea label="Details" v-model="details"></v-textarea>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
</template>

<script>
    export default {
        components: {},
        data: () => ({

        }),
        computed: {
            details: {
                get () { return this.$store.getters['event/details'] },
                set (value) { this.$store.commit('event/details',value) }
            },                                                                                 
        },
        methods: {

        },
        watch: {

        }
    }
</script>