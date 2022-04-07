<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card flat>
                    <v-card-title>
                        <h3>Bond Information</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs6>
                                ISIN
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationIsin}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Description
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationDescription}}
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs6>
                                Initial Size
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationInitialSize}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Current Amount Outstanding
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationCurrentAmountOutstanding}}
                            </v-flex>
                        </v-layout>   
                        <v-layout row wrap>
                            <v-flex xs6>
                                Currency
                            </v-flex>
                            <v-flex xs6>
                                {{currency_name}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Coupon
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationCoupon}}
                            </v-flex>
                        </v-layout>  
                        <v-layout row wrap>
                            <v-flex xs6>
                                Issue Date
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationIssueDate | iso-8601-date-to-european-format}}
                            </v-flex>
                        </v-layout>   
                        <v-layout row wrap>
                            <v-flex xs6>
                                Maturity Date
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationMaturityDate | iso-8601-date-to-european-format }}
                            </v-flex>
                        </v-layout>   
                        <v-layout row wrap>
                            <v-flex xs6>
                                Soft Call Date
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationSoftCallDate | iso-8601-date-to-european-format}}
                            </v-flex>
                        </v-layout>   
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        props: ['projectId'],
        components: {
        },
        data: () => ({

        }),
        methods: {

        },
        computed: {
            ...mapGetters('project',[
                'bondInformationIsin',
                'bondInformationDescription',
                'bondInformationCurrencyId',
                'bondInformationInitialSize',
                'bondInformationCurrentAmountOutstanding',
                'bondInformationCoupon',
                'bondInformationIssueDate',
                'bondInformationMaturityDate',
                'bondInformationSoftCallDate'
            ]),            
            // ...mapGetters('currency_field',['getCurrencyById'],
            currency_name() {
                if(this.bondInformationCurrencyId) {
                   let currency = this.$store.getters['currency_field/getCurrencyById'](this.bondInformationCurrencyId)
                   if(currency) {
                    return currency.code
                   }
                } else {
                    return ''
                }
            }
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
