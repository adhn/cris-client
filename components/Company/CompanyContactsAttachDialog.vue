<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-btn slot="activator" flat color="primary"><v-icon>attachment</v-icon></v-btn>
        <v-card>
            <v-card-title>
                <h2>Attach existing contact</h2>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                <v-flex xs8>
                    <contact-field v-model="selectedContact"/>
                </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" flat @click="dialog=false">Close</v-btn>
                <v-btn color="primary" @click="attach()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>    
</template>
<script>
    // import {mapGetters} from 'vuex';
    import ContactField from '~/components/Fields/ContactField.vue'

    export default {
        props: [],
        components: {
            ContactField
        },
        data: () => ({
            dialog: false,
            selectedContact: null
        }),
        methods: {
            attach() {
                if(this.selectedContact) {
                    Promise.all([
                        this.$store.dispatch('company/associateContact',this.selectedContact)
                    ]).then(this.dialog=false).then(this.$store.dispatch('contact_list/fetchData'))        
                }
            }
        },
        computed: {

        },
        watch: {
            dialog(value,oldValue) {
                this.$store.commit('visibility/visible',!value)
            }
        },
        mounted: function() {
            this.$store.dispatch('contact_field/fetchContacts')
        }
    }
</script>