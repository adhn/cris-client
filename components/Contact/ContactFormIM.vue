<template>
            <v-card flat>
                <v-card-title><h3>Instant Messaging</h3></v-card-title>
                <v-card-text>       
                <template v-for="(item,key) in im_addresses">
                    <v-layout v-bind:key="key" row wrap>
                        <v-flex xs10 >
                                <v-text-field :disabled="readonly" :value="item" @input="update(key,$event)" label="Instant Messaging Address"></v-text-field>
                        </v-flex>
                        <v-spacer />
                        <v-btn v-if="!readonly" outline small color="primary" icon @click="remove(item,key)">
                            <v-icon>remove</v-icon>
                        </v-btn>
                    </v-layout>
                </template>
                </v-card-text>
                <v-card-actions>
                    <v-btn v-if="!readonly" fab small outline dark color="primary" @click="add">
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        components: {},
        data: () => ({

        }),
        computed: {
            ...mapGetters('contact',[
                'im_addresses',
                'readonly'
            ])
        },
        methods: {
            add() {
                this.$store.commit('contact/addInstantMessagingAddress')
            },
            remove(item,key) {
                this.$store.commit('contact/removeInstantMessagingAddress',{
                    key: key
                })
            },
            update(key,e) {
                this.$store.commit('contact/updateInstantMessagingAddress',{
                    key: key,
                    value: e
                })
            }
        },
        mounted() {
        },
    }
</script>