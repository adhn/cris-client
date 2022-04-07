<template>
<v-layout row wrap>
    <v-flex xs12>
        <v-card>
            <v-card-title>
                <h3>Bond Information</h3>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs3>
                        <v-text-field :label="'ISIN'" v-model="isin" />
                    </v-flex>
                    <v-flex xs8 ml-3>
                        <v-text-field :label="'Description'" v-model="description" />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs3>
                        <v-text-field :label="'Initial Size'" v-model="initial_size" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <v-text-field :label="'Current Amount Outstanding'" v-model="current_amount_outstanding" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <currency-field :label="'Currency'" v-model="currency_id" />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs3>
                        <v-text-field :label="'Coupon'" v-model="coupon" />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs3>
                        <date-field :label="'Issue Date'" v-model="issue_date" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <date-field :label="'Maturity Date'" v-model="maturity_date" />
                    </v-flex>
                    <v-flex xs3 ml-3>
                        <date-field :label="'Soft Call Date'" v-model="soft_call_date" />
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
            isin: {
                get () { return this.$store.getters['project/bondInformationIsin'] },
                set (value) { this.$store.commit('project/bondInformationIsin',value) }
            },
            description: {
                get () { return this.$store.getters['project/bondInformationDescription'] },
                set (value) { this.$store.commit('project/bondInformationDescription',value) }
            },
            currency_id: {
                get () { return this.$store.getters['project/bondInformationCurrencyId'] },
                set (value) { this.$store.commit('project/bondInformationCurrencyId',value) }
            },
            initial_size: {
                get () { return this.$store.getters['project/bondInformationInitialSize'] },
                set (value) { this.$store.commit('project/bondInformationInitialSize',value) }
            },
            current_amount_outstanding: {
                get () { return this.$store.getters['project/bondInformationCurrentAmountOutstanding'] },
                set (value) { this.$store.commit('project/bondInformationCurrentAmountOutstanding',value) }
            },
            coupon: {
                get () { return this.$store.getters['project/bondInformationCoupon'] },
                set (value) { this.$store.commit('project/bondInformationCoupon',value) }
            },
            issue_date: {
                get () { return this.$store.getters['project/bondInformationIssueDate'] },
                set (value) { this.$store.commit('project/bondInformationIssueDate',value) }
            },
            maturity_date: {
                get () { return this.$store.getters['project/bondInformationMaturityDate'] },
                set (value) { this.$store.commit('project/bondInformationMaturityDate',value) }
            },
            soft_call_date: {
                get () { return this.$store.getters['project/bondInformationSoftCallDate'] },
                set (value) { this.$store.commit('project/bondInformationSoftCallDate',value) }
            } 
        },
        watch: {

        }
    }
</script>


