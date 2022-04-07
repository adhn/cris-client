<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card flat>
                    <v-card-title>
                        <h3>Transaction Structure</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Default Settlment Option
                            </v-flex>
                            <v-flex xs6>
                                {{defaultSettlementOptionName}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Settlement Options
                            </v-flex>
                            <v-flex xs6>
                                {{settlementOptionsToString}}
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs6>
                                Mandatory
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationMandatory | boolToHuman}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Secured
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationSecured | boolToHuman}}
                            </v-flex>
                        </v-layout>   
                        <v-layout row wrap>
                            <v-flex xs6>
                                Hedge
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationHedge | boolToHuman}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Contingent Conversion
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationContingentConversion | boolToHuman}}
                            </v-flex>
                        </v-layout>  
                        <v-layout row wrap>
                            <v-flex xs6>
                                Convertible or Exchangeable
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationConvertibleOrExchangeable | toTitleCase}}
                            </v-flex>
                        </v-layout>   
                        <v-layout row wrap>
                            <v-flex xs6>
                                Price or Ratio
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationPriceOrRatio | toTitleCase}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                {{currentLabel}} Date
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationCurrentDate | iso-8601-date-to-european-format }}
                            </v-flex>
                        </v-layout>   
                        <v-layout row wrap>
                            <v-flex xs6>
                                {{currentLabel}} 1:
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationCurrent1}}
                            </v-flex>
                        </v-layout>  

                        <v-layout row wrap>
                            <v-flex xs6>
                                {{currentLabel}} 2:
                            </v-flex>
                            <v-flex xs6>
                                {{bondInformationCurrent2}}
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
                'bondInformationDefaultSettlementOptionId',
                'bondInformationSettlementOptions',
                'bondInformationMandatory',
                'bondInformationSecured',
                'bondInformationHedge',
                'bondInformationContingentConversion',
                'bondInformationConvertibleOrExchangeable',
                'bondInformationPriceOrRatio',
                'bondInformationCurrentDate',
                'bondInformationCurrent1',
                'bondInformationCurrent2'
            ]),            
            currency_name() {
                if(this.bondInformationCurrencyId) {
                   let currency = this.$store.getters['currency_field/getCurrencyById'](this.bondInformationCurrencyId)
                   if(currency) {
                    return currency.code
                   }
                } else {
                    return ''
                }
            },
            defaultSettlementOptionName() {
                if(this.bondInformationDefaultSettlementOptionId) {
                   let settlementOption = this.$store.getters['settlement_option_field/getById'](this.bondInformationDefaultSettlementOptionId)
                   console.info(settlementOption)
                   if(settlementOption) {
                    return settlementOption.option
                   }
                } else {
                    return ''
                }
            },
            settlementOptionsToString() {
                if(this.bondInformationSettlementOptions) {
                    let settlementOptionStrings = this.bondInformationSettlementOptions.map(o => o.option)
                    return settlementOptionStrings.join(', ')
                } 
                return ''
            },
            currentLabel() {
                // console.info('updateLabel',this.bondInformationConvertibleOrExchangeable,this.bondInformationPriceOrRatio)
                let out = []
                if(this.bondInformationConvertibleOrExchangeable == 'CONVERTIBLE') {
                    out.push('Conversion')
                } else {
                    out.push('Exchange')
                }

                if(this.bondInformationPriceOrRatio == 'PRICE') {
                    out.push('Price')
                } else {
                    out.push('Ratio')
                }
                return out.join(' ')
            },
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
