<template>
            <v-card flat>
                <v-card-title>
                    <h3>Email addresses</h3>

                </v-card-title>
                <v-card-text>
                <template v-for="(item,key) in emailAddresses">
                    <v-layout v-bind:key="key" row wrap>
                        <v-flex xs6 >
                                <v-text-field
                                :disabled="readonly"
                                :value="item.email" 
                                @input="updateEmailAddress('email',key,$event)" 
                                label="Email" />
                        </v-flex>
                        <v-flex xs5 pl-3>
                                <v-text-field 
                                :disabled="readonly"
                                :value="item.display_name"
                                @input="updateEmailAddress('display_name',key,$event)" 
                                label="Display Name" />
                        </v-flex>
                            <v-spacer></v-spacer>
                            
                        <v-btn v-if="!readonly" outline small dark color="primary" icon @click="remove(item,key)">
                            <v-icon>remove</v-icon>
                        </v-btn>
                    </v-layout>
                </template>
                </v-card-text>
                <v-card-actions>
                    <template v-if="!readonly">
                    <v-btn fab small outline dark color="primary" @click="add">
                        <v-icon>add</v-icon>
                    </v-btn>
                    </template>
                </v-card-actions>
            </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        props: ['contact'],
        components: {},
        data: () => ({

        }),
        computed: {
            ...mapGetters('contact',[
                'emailAddresses',
                'readonly'
            ]),
        },
        methods: {
            add() {
                this.$store.commit('contact/addEmailAddress')
            },
            remove(item,key) {
                this.$store.commit('contact/removeEmailAddress',{
                    // item: item,
                    key: key
                })
            },
            updateEmailAddress(field,key,e) {
                console.info(e,field,key)
                this.$store.commit('contact/updateEmailAddress',{
                    field: field,
                    key: key,
                    value: e
                })
            }

        },
        mounted() {
        },
    }
</script>