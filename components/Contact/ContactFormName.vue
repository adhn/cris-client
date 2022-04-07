<template>
            <v-card flat>
                <v-card-title><h3>Name</h3></v-card-title>
                <v-card-text>     
                    <v-layout row wrap>
                            <v-flex xs3>
                                <v-text-field v-if="showTitle" v-model="title" :disabled="readonly" label="Title"></v-text-field>
                            </v-flex>
                            <v-flex xs3 pl-3>
                                <v-text-field v-model="given_name" :disabled="readonly" label="First Name"></v-text-field>
                            </v-flex>
                            <v-flex xs3 pl-3>
                                <v-text-field v-if="showMiddleName" v-model="middle_name" :disabled="readonly" label="Middle Name"></v-text-field>
                            </v-flex>
                            <v-flex xs3 pl-3>
                                <v-text-field v-model="surname" :disabled="readonly" label="Surname"></v-text-field>
                            </v-flex>


                            <!-- <v-flex xs2>
                                <v-text-field v-if="showSuffix" xs3 v-model="suffix" label="Suffix"></v-text-field>
                            </v-flex>
                            <v-flex xs10></v-flex> -->

                            <v-flex xs2></v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3>
                                <v-text-field v-if="showYomiGivenName" v-model="yomi_given_name" :disabled="readonly" label="Yomi first name"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3></v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3>
                                <v-text-field v-if="showYomiSurname" v-model="yomi_surname" :disabled="readonly" label="Yomi surname"></v-text-field>
                            </v-flex>
                        </v-layout>

                </v-card-text>
                            <v-card-actions>
                                <template v-if="!readonly">
                                <v-menu offset-y>
                                    <v-btn slot="activator" fab small outline dark color="primary">
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                    <v-list>
                                        <v-list-tile v-for="(item, index) in toggleFields" :key="index" @click="toggleField(item)">
                                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                                </template>
                            </v-card-actions>
            </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        data: () => ({
            toggleFields: [
                {title: 'Middle Name', toggle:'toggleShowMiddleName'},
                {title: 'Title', toggle:'toggleShowTitle'},
                // {title: 'Suffix',toggle:'toggleShowSuffix'},
                {title: 'Yomi Given Name',toggle:'toggleShowYomiGivenName'},
                {title: 'Yomi Surname',toggle:'toggleShowYomiSurname'}
            ]
        }),
        computed: {
            ...mapGetters('contact',[
              'showMiddleName','showTitle','showYomiGivenName','showYomiSurname','readonly'
            ]),
            given_name: {
                get () { return this.$store.getters['contact/given_name'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',given_name: value})}
            },
            surname: {
                get () { return this.$store.getters['contact/surname']  },
                set (value) { this.$store.commit({type: 'contact/updateContact',surname: value})}
            },
            middle_name: {
                get () { return this.$store.getters['contact/middle_name']  },
                set (value) { this.$store.commit({type: 'contact/updateContact',middle_name: value})}
            },
            title: {
                get () { return this.$store.getters['contact/title']  },
                set (value) { this.$store.commit({type: 'contact/updateContact',title: value})}
            },
            // suffix: {
            //     get () { return this.$store.getters['contact/suffix']  },
            //     set (value) { this.$store.commit({type: 'contact/updateContact',suffix: value})}
            // },
            yomi_given_name: {
                get () { return this.$store.getters['contact/yomi_given_name']  },
                set (value) { this.$store.commit({ type: 'contact/updateContact', yomi_given_name: value})}
            },
            yomi_surname: {
                get () { return this.$store.getters['contact/yomi_surname'] },
                set (value) { this.$store.commit({ type: 'contact/updateContact', yomi_surname: value})}
            }
        },
        methods: {
            toggleField(item) {
                // item.toggle contains the method to commit
                this.$store.commit({ type: 'contact/'+item.toggle})
            }
        }
    }
</script>