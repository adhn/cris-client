<template>
<v-layout row wrap>
    <v-flex xs12>
        <v-card>
            <v-card-title>
                <h3>Fee Structure</h3>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs3 ml-3>
                        <currency-field :multiple="false" :label="'Currency'" v-model="currency_id" />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs3 ml-3>
                        <v-text-field :label="'Acceptance Fee'" v-model="acceptance_fee" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <v-text-field :label="'Annual Fee'" v-model="annual_fee" />
                    </v-flex>
                </v-layout>


                <v-layout row wrap>
                    <v-flex xs3 ml-3>
                        <v-text-field :label="'Settlement Calculation Fee'" v-model="settlement_calculation_fee" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <v-text-field :label="'Settlement Calculation Fee Cap'" v-model="settlement_calculation_fee_cap" />
                    </v-flex>
                </v-layout>

            </v-card-text>
        </v-card>
    </v-flex>
</v-layout>
</template>
<script>
    import DateField from '~/components/Fields/DateField.vue'
    import CurrencyField from '~/components/Fields/CurrencyField.vue'

    export default {
        components: {DateField,CurrencyField},
        data: () => ({
        }),
        computed: {
            currency_id: {
                get () { return this.$store.getters['project/feeStructureCurrencyId'] },
                set (value) { this.$store.commit('project/feeStructureCurrencyId',value) }
            },
            acceptance_fee: {
                get () { return this.$store.getters['project/feeStructureAcceptanceFee'] },
                set (value) { this.$store.commit('project/feeStructureAcceptanceFee',value) }
            },
            annual_fee: {
                get () { return this.$store.getters['project/feeStructureAnnualFee'] },
                set (value) { this.$store.commit('project/feeStructureAnnualFee',value) }
            },
            settlement_calculation_fee: {
                get () { return this.$store.getters['project/feeStructureSettlementCalculationFee'] },
                set (value) { this.$store.commit('project/feeStructureSettlementCalculationFee',value) }
            },
            settlement_calculation_fee_cap: {
                get () { return this.$store.getters['project/feeStructureSettlementCalculationFeeCap'] },
                set (value) { this.$store.commit('project/feeStructureSettlementCalculationFeeCap',value) }
            },
        },
        methods: {

        },
        watch: {

        },
        mounted() {

        }
    }
</script>




