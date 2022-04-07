<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card flat>
                    <v-card-title>
                        <h3>Fee Structure</h3>
                    </v-card-title>
                    <v-card-text>
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
                                Acceptance Fee
                            </v-flex>
                            <v-flex xs6>
                                {{feeStructureAcceptanceFee}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Annual Fee
                            </v-flex>
                            <v-flex xs6>
                                {{feeStructureAnnualFee}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Settlement Calculation Fee
                            </v-flex>
                            <v-flex xs6>
                                {{feeStructureSettlementCalculationFee}}
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                Settlement Calculation Fee Cap
                            </v-flex>
                            <v-flex xs6>
                                {{feeStructureSettlementCalculationFeeCap}}
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
                'feeStructureCurrencyId',
                'feeStructureAcceptanceFee',
                'feeStructureAnnualFee',
                'feeStructureSettlementCalculationFee',
                'feeStructureSettlementCalculationFeeCap'
            ]), 
            currency_name() {
                if(this.feeStructureCurrencyId) {
                   let currency = this.$store.getters['currency_field/getCurrencyById'](this.feeStructureCurrencyId)
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
