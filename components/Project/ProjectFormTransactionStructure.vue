<template>
<v-layout row wrap>
    <v-flex xs12>
        <v-card>
            <v-card-title>
                <h3>Transaction Structure</h3>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs3 ml-3>
                        <settlement-option-field :multiple="false" :label="'Default Settlement Option'" v-model="default_settlement_option_id" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <settlement-option-field :multiple="true" :label="'Settlement Options'" v-model="settlementOptions" />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs3 pl-3>
                        <v-checkbox :label="'Mandatory'" v-model="mandatory" />
                    </v-flex>
                    <v-flex xs3 pl-3>
                        <v-checkbox :label="'Secured'" v-model="secured" />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs3 pl-3>
                        <v-checkbox :label="'Hedge'" v-model="hedge" />
                    </v-flex>
                    <v-flex xs3 pl-3>
                        <v-checkbox :label="'Contingent conversion'" v-model="contingent_conversion" />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs3 ml-3>
                        <v-radio-group v-model="convertible_or_exchangeable" row>
                            <v-radio label="Convertible" value="CONVERTIBLE"></v-radio>
                            <v-radio label="Exchangeable" value="EXCHANGEABLE"></v-radio>
                        </v-radio-group>
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <v-radio-group v-model="price_or_ratio" row>
                            <v-radio label="Price" value="PRICE"></v-radio>
                            <v-radio label="Ratio" value="RATIO"></v-radio>
                        </v-radio-group>
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs3>
                        <date-field :label="currentLabel+ ' Date'" v-model="current_date" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <v-text-field :label="currentLabel+ ' 1'" v-model="current_1" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <v-text-field :label="currentLabel+ ' 2'" v-model="current_2" />
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</v-layout>
</template>
<script>
    import DateField from '~/components/Fields/DateField.vue'
    import SettlementOptionField from '~/components/Fields/SettlementOptionField.vue'

    export default {
        components: {DateField,SettlementOptionField},
        data: () => ({
            currentLabel: ''
        }),
        computed: {
            default_settlement_option_id: {
                get () { return this.$store.getters['project/bondInformationDefaultSettlementOptionId'] },
                set (value) { this.$store.commit('project/bondInformationDefaultSettlementOptionId',value) }
            },
            settlementOptions: {
                get () { return this.$store.getters['project/bondInformationSettlementOptions'] },
                set (value) { this.$store.commit('project/bondInformationSettlementOptions',value) }
            },
            mandatory: {
                get () { return this.$store.getters['project/bondInformationMandatory'] },
                set (value) { this.$store.commit('project/bondInformationMandatory',value) }
            },
            secured: {
                get () { return this.$store.getters['project/bondInformationSecured'] },
                set (value) { this.$store.commit('project/bondInformationSecured',value) }
            },
            hedge: {
                get () { return this.$store.getters['project/bondInformationHedge'] },
                set (value) { this.$store.commit('project/bondInformationHedge',value) }
            },
            contingent_conversion: {
                get () { return this.$store.getters['project/bondInformationContingentConversion'] },
                set (value) { this.$store.commit('project/bondInformationContingentConversion',value) }
            },
            convertible_or_exchangeable: {
                get () { return this.$store.getters['project/bondInformationConvertibleOrExchangeable'] },
                set (value) { 
                    this.$store.commit('project/bondInformationConvertibleOrExchangeable',value)
                    this.updateLabel()
 
                }
            },
            price_or_ratio: {
                get () { return this.$store.getters['project/bondInformationPriceOrRatio'] },
                set (value) {
                    this.$store.commit('project/bondInformationPriceOrRatio',value) 
                    this.updateLabel()

                }
            },
            current_date: {
                get () { return this.$store.getters['project/bondInformationCurrentDate'] },
                set (value) { this.$store.commit('project/bondInformationCurrentDate',value) }
            },
            current_1: {
                get () { return this.$store.getters['project/bondInformationCurrent1'] },
                set (value) { this.$store.commit('project/bondInformationCurrent1',value) }
            },
            current_2: {
                get () { return this.$store.getters['project/bondInformationCurrent2'] },
                set (value) { this.$store.commit('project/bondInformationCurrent2',value) }
            },
        },
        methods: {
            updateLabel() {
                console.info('updateLabel',this.convertible_or_exchangeable,this.price_or_ratio)
                let out = []
                if(this.convertible_or_exchangeable == 'CONVERTIBLE') {
                    out.push('Conversion')
                } else {
                    out.push('Exchange')
                }

                if(this.price_or_ratio == 'PRICE') {
                    out.push('Price')
                } else {
                    out.push('Ratio')
                }
                this.currentLabel = out.join(' ')
            },
        },
        watch: {
            // convertible_or_exchangeable() {
            //     updateLabel()
            // },
            // price_or_ratio() {
            //     updateLabel()
            // }
        },
        mounted() {
            this.updateLabel()
        }
    }
</script>




