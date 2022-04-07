<template>
            <v-card flat>
                <v-card-title>
                    <h3>Companies</h3>
                </v-card-title>
                <v-card-text>
                <template v-for="(item,key) in contactCompanies">
                    <v-layout v-bind:key="key" row wrap>
                        <v-flex xs6 >
                            <v-select
                            :disabled="readonly"
                            :items="companies"
                            label="Company"
                            item-value="id"
                            item-text="name"
                            :value="item.id"
                            @input="updateCompany('id',key,$event)"
                            ></v-select>
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
        components: {},
        data: () => ({

        }),
        computed: {
            ...mapGetters('contact',[
                'companies','contactCompanies','readonly'
            ]),
        },
        methods: {
            add() {
                this.$store.commit('contact/addCompany')
            },
            remove(item,key) {
                this.$store.commit('contact/removeCompany',{
                    // item: item,
                    key: key
                })
            },
            updateCompany(field,key,e) {
                console.info(e,field,key)
                this.$store.commit('contact/updateCompany',{
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