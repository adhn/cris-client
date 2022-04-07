<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <h3>Main Information</h3>
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-text-field label="Project Title" v-model="name"></v-text-field>
                        </v-flex>
                        <v-flex xs3 ml-3>
                                <project-type-field label="Project Type" v-model="project_type_id" />
                        </v-flex>

                        <!-- <v-flex xs3 ml-3>
                                <v-text-field label="Active/Archived?"></v-text-field>
                        </v-flex> -->
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                                <company-field label="Issuer" v-model="issuer_company_id" />
                        </v-flex>
                        <v-flex xs3 ml-3>
                                <country-field label="Issuer country" v-model="issuer_country_id" />
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                                <company-field label="Guarantor" v-model="guarantor_company_id" />

                        </v-flex>
                        <v-flex xs3 ml-3>
                                <country-field label="Guarantor country" v-model="guarantor_country_id" />
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-text-field label="Underlying Stock Name" v-model="underlying_stock_name"></v-text-field>
                        </v-flex>
                        <v-flex xs3 ml-3>
                                <country-field label="Underlying Stock Country" v-model="underlying_stock_country_id" />
                        </v-flex>
                    </v-layout>

                    <one-drive-location v-model="onedrive_folder_location" :label="'Select Project folder location'"/>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import ProjectTypeField from '~/components/Fields/ProjectTypeField.vue'
    import CountryField from '~/components/Fields/CountryField.vue'
    import CompanyField from '~/components/Fields/CompanyField.vue'
    import OneDriveLocation from '~/components/OneDriveLocation.vue'
    
    // https://forum.vuejs.org/t/vuejs-sending-v-model-property-from-child-to-parent/22884/2


    export default {
        components: {ProjectTypeField,CountryField,CompanyField,OneDriveLocation},
        data: () => ({
            projectLocation: null
        }),
        computed: {
            name: {
                get () { return this.$store.getters['project/name'] },
                set (value) { this.$store.commit('project/name',value) }
            },
            active: {
                get () { return this.$store.getters['project/active'] },
                set (value) { this.$store.commit('project/active',value) }
            },
            underlying_stock_name: {
                get () { return this.$store.getters['project/underlying_stock_name'] },
                set (value) { this.$store.commit('project/underlying_stock_name',value) }
            },
            project_type_id: {
                get () { return this.$store.getters['project/project_type_id'] },
                set (value) { 
                    this.$store.commit('project/project_type_id',value)
                    console.info('project_type_id',value) 
                }
            },
            issuer_country_id: {
                get () { return this.$store.getters['project/issuer_country_id'] },
                set (value) { this.$store.commit('project/issuer_country_id',value) }
            },
            guarantor_country_id: {
                get () { return this.$store.getters['project/guarantor_country_id'] },
                set (value) { this.$store.commit('project/guarantor_country_id',value) }
            },
            underlying_stock_country_id: {
                get () { return this.$store.getters['project/underlying_stock_country_id'] },
                set (value) { this.$store.commit('project/underlying_stock_country_id',value) }
            },
            issuer_company_id: {
                get () { return this.$store.getters['project/issuer_company_id'] },
                set (value) { this.$store.commit('project/issuer_company_id',value) }
            },
            guarantor_company_id: {
                get () { return this.$store.getters['project/guarantor_company_id'] },
                set (value) { this.$store.commit('project/guarantor_company_id',value) }
            },
            onedrive_folder_location: {
                get () { return this.$store.getters['project/onedrive_folder_location'] },
                set (value) { this.$store.commit('project/onedrive_folder_location',value) }
            },                                                                                                           
        },
        watch: {
            issuer_country_id (val,oldVal) {
                console.info('issuer_country_id',val,oldVal)
            },
            project_type_id (val,oldVal) {
                console.info('project_type_id',val,oldVal)
            },
            onedrive_folder_location(val,oldVal) {
                console.info('onedrive_folder_location',val,oldVal)
            }
        }
    }
</script>