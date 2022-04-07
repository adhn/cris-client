<template>
            <v-card flat>
                <v-card-title><h3>Phones</h3></v-card-title>
                <v-card-text>                    
                    <template v-if="this.business_phones">
                    <h4>Business</h4>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-text-field :disabled="readonly" :value="this.business_phones[0]" @input="updatePhone('business_phones',0,$event)" label="Business Phone 1"></v-text-field>
                        </v-flex>
                        <v-flex xs6 pl-3>
                            <v-text-field :disabled="readonly" :value="this.business_phones[1]" @input="updatePhone('business_phones',1,$event)" label="Business Phone 2"></v-text-field>
                        </v-flex>
                    </v-layout>
                    </template>
                    <template v-if="this.home_phones">
                    <h4>Home</h4>
                    <v-layout row wrap>
                        <v-flex xs6>
                                <v-text-field :disabled="readonly" :value="this.home_phones[0]" @input="updatePhone('home_phones',0,$event)" label="Home Phone 1"></v-text-field>
                        </v-flex>
                        <v-flex xs6 pl-3>
                                <v-text-field :disabled="readonly" :value="this.home_phones[1]" @input="updatePhone('home_phones',1,$event)" label="Home Phone 2"></v-text-field>
                        </v-flex>
                    </v-layout>
                    </template>

                    <h4>Mobile</h4>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-text-field :disabled="readonly" :value="mobile_phone" @input="mobile_phone = $event" label="Mobile phone"></v-text-field>
                        </v-flex>
                        <!-- <v-flex xs6 pl-3>
                            <v-text-field :value="this.mobile_phone[1]" @input="updatePhone('mobile_phone',1,$event)" label="Mobile phone 2"></v-text-field>
                        </v-flex> -->
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
            ...mapGetters('contact',[
                'business_phones',
                'home_phones',
                'readonly'
            ]),
            mobile_phone: {
                get() {return this.$store.getters['contact/mobile_phone']},
                set(val) {this.$store.commit('contact/mobile_phone',val)}
            }
        },
        methods: {
            updatePhone(field,key,e) {
                this.$store.commit('contact/updatePhone',{
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