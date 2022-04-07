<template>
    <v-card>
        <v-card-title>
            <h3>Main Information</h3>
        </v-card-title>
        <v-card-text>
            <v-layout row wrap>
                <v-flex xs3>
                        <v-text-field label="Company Name" v-model="name"></v-text-field>
                </v-flex>

                <v-flex xs3 ml-3>
                        <v-select 
                            v-model="status"
                            :label="'Company Status'"
                            :items="companyStatuses"
                            item-text="name"
                            item-value="id"
                        />
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs3>
                        <contact-field :multiple="false" label="Primary Contact" v-model="primary_contact_id" />
                </v-flex>
                <v-flex xs3 ml-3>
                        <contact-field :multiple="false" label="Billing Contact" v-model="billing_contact_id" />
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs6>
                        <v-textarea label="Company Address" v-model="company_address" />
                </v-flex>
            </v-layout>

            <one-drive-location :value="onedrive_folder_location" :label="'Select Company folder location'"/>

        </v-card-text>
    </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';
    import ContactField from '~/components/Fields/ContactField.vue'
    import OneDriveLocation from '~/components/OneDriveLocation.vue'

    export default {
        components: {ContactField,OneDriveLocation},
        data: () => ({
            companyStatuses: [
                {id:'ACTIVE',name:'ACTIVE'},
                {id:'PROSPECT',name:'PROSPECT'}
            ]
        }),
        methods: {
            save() {
                this.$store.dispatch('company/save')
            },
            close() {
                if(this.id) {
                    this.$router.push({ name: 'companies-id', params: { id: this.id }})
                } else {
                    this.$router.push({ name: 'companies'})
                }
            }
        }, 
        computed: {
            ...mapGetters('company',['id']),
            name: {
                get () { return this.$store.getters['company/name'] },
                set (value) { this.$store.commit('company/name',value) }
            },
            primary_contact_id: {
                get () { return this.$store.getters['company/primary_contact_id'] },
                set (value) { this.$store.commit('company/primary_contact_id',value) }
            },
            billing_contact_id: {
                get () { return this.$store.getters['company/billing_contact_id'] },
                set (value) { this.$store.commit('company/billing_contact_id',value) }
            },
            company_address: {
                get () { return this.$store.getters['company/company_address'] },
                set (value) { this.$store.commit('company/company_address',value) }
            },
            status: {
                get () { return this.$store.getters['company/status'] },
                set (value) { 
                    this.$store.commit('company/status',value) 

                }
            },
            onedrive_folder_location: {
                get () { return this.$store.getters['company/onedrive_folder_location'] },
                set (value) { this.$store.commit('company/onedrive_folder_location',value) }
            },  
        }
    }
</script>
<style>
  .fab-container {
    position: fixed;
    top: 64px;
    right: 0;
  }
</style>