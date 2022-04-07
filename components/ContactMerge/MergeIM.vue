<template>
            <v-card>
                <v-card-title><h3>Instant Messaging</h3></v-card-title>
                <v-card-text>       
                <template v-for="(item,key) in contact.imAddresses">
                    <v-layout v-bind:key="key" row wrap>
                        <v-flex p>
                            <v-btn icon @click="copyIM(item)"><v-icon>reply</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs10 >
                                <v-text-field :value="item" @input="update(key,$event)" label="Instant Messaging Address"></v-text-field>
                        </v-flex>
                    </v-layout>
                </template>
                </v-card-text>
            </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        components: {},
        props:['contact'],
        data: () => ({

        }),
        computed: {

        },
        methods: {
            copyIM(item) {
                this.$store.commit('contact/addInstantMessagingAddressWithValue',item)
            },
        },
        mounted() {
        },
    }
</script>