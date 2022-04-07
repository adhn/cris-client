<template>
            <v-card flat>
                <v-card-title><h3>Other</h3></v-card-title>
                <v-card-text>     
                    <v-layout row wrap>
                            <v-flex xs4>
                                <date-field :enabled="!readonly" v-model="birthday" :label="'Birthday'" />
                            </v-flex>
                            <v-flex xs4 pl-3>
                                <v-text-field :disabled="readonly" v-model="nick_name" label="Nick name"></v-text-field>
                            </v-flex>
                            <v-flex xs4 pl-3>
                                <v-text-field :disabled="readonly" v-model="spouse_name" label="Spouse"></v-text-field>
                            </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
</template>
<script>
    import DateField from '~/components/Fields/DateField.vue'
    import {mapGetters} from 'vuex';

    export default {
        components: {DateField},
        data: () => ({

        }),
        computed: {
            birthday: {
                get () { return this.$store.getters['contact/birthday'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',birthday: value})}
            },
            nick_name: {
                get () { return this.$store.getters['contact/nick_name'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',nick_name: value})}
            },
            spouse_name: {
                get () { return this.$store.getters['contact/spouse_name'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',spouse_name: value})}
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

    // birthday (datetime z)
    // nick_name
    // spouse : significant other


    // this data is not present in db / graph object, maybe it is present in extensions:  
        // personal webpage
        // school
        // hobbies
        // location
        // webpage
        // anniversary

</script>