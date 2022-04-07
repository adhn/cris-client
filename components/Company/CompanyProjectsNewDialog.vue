<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-btn slot="activator" flat color="primary"><v-icon>add</v-icon></v-btn>
        <v-card>
            <v-toolbar>
                <v-toolbar-title>Add new project to Company</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn flat color="" @click="dialog = false">
                        Close
                        <v-icon right>close</v-icon>
                    </v-btn>
                    <v-btn class ="ml-3" flat large color="primary" @click="save()">Save<v-icon right>save</v-icon></v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <project-form-main-information class="mb-3" />
                
                <template v-if="showBondInformationAndFeeStructure">
                    <project-form-bond-information class="mb-3" />
                    <project-form-transaction-structure class="mb-3" />
                    <project-form-fee-structure class="mb-3" />
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>    
</template>
<script>
    import {mapGetters} from 'vuex';

    import ProjectFormMainInformation from '~/components/Project/ProjectFormMainInformation.vue'
    import ProjectFormBondInformation from '~/components/Project/ProjectFormBondInformation.vue'
    import ProjectFormTransactionStructure from '~/components/Project/ProjectFormTransactionStructure.vue'
    import ProjectFormFeeStructure from '~/components/Project/ProjectFormFeeStructure.vue'

    import ProjectFormCompanies from '~/components/Project/ProjectFormCompanies.vue'
    import ProjectFormContacts from '~/components/Project/ProjectFormContacts.vue'

    export default {
        props: [],
        components: {ProjectFormMainInformation,ProjectFormBondInformation,ProjectFormTransactionStructure,ProjectFormFeeStructure,ProjectFormCompanies,ProjectFormContacts},
        data: () => ({
            dialog: false,
        }),
        methods: {
            save() {
                return this.$store.dispatch('project/save')
            },
        },
        computed: {
            ...mapGetters('project',['id','name','project_type_id','showBondInformationAndFeeStructure']),
        },
        watch: {
            dialog(value,oldValue) {
                if(value == true) {
                    this.$store.commit('project/reset'),
                    Promise.all([
                        this.$store.dispatch('project_type_field/fetchProjectTypes'),
                        this.$store.dispatch('country_field/fetchCountries'),
                        this.$store.dispatch('company_field/fetchCompanies'),
                        this.$store.dispatch('currency_field/fetchCurrencies'),
                        this.$store.dispatch('settlement_option_field/fetchSettlementOptions')
                    ])
                }

                this.$store.commit('visibility/visible',!value)

            }
        },
        mounted: function() {

        }
    }
</script>