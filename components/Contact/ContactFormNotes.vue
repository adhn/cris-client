<template>
            <v-card flat>
                <v-card-title><h3>Notes</h3></v-card-title>
                <v-card-text>     
                    <v-layout row wrap>
                        <!-- <v-text-field v-model="personal_notes" full-width multi-line label="Write notes here"></v-text-field> -->
                        <v-textarea :disabled="readonly" v-model="personal_notes" label="Write notes here"></v-textarea>
                    </v-layout>
                </v-card-text>
            </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';


    export default {
        components: {},
        data: () => ({

        }),
        computed: {
            personal_notes: {
                get () { return this.$store.getters['contact/personal_notes'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',personal_notes: value})}
            },
            ...mapGetters('contact',[
                'readonly'
            ]),
        },
        methods: {

        },
        mounted() {
        },
    }
</script>