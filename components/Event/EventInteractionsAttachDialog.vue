<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-btn slot="activator" flat color="primary"><v-icon>attachment</v-icon></v-btn>
        <v-card>
            <v-card-title>
                <h2>Attach existing interaction</h2>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                <v-flex xs8>
                    <interaction-field v-model="selectedInteraction"/>
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
    import InteractionField from '~/components/Fields/InteractionField.vue'

    export default {
        props: [],
        components: {
            InteractionField
        },
        data: () => ({
            dialog: false,
            selectedInteraction: null
        }),
        methods: {
            attach() {
                if(this.selectedInteraction) {
                    Promise.all([
                        this.$store.dispatch('event/associateInteraction',this.selectedInteraction)
                    ]).then(this.dialog=false).then(this.$store.dispatch('interaction_list/fetchInteractions'))        
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
            this.$store.dispatch('interaction_field/fetchInteractions')
        }
    }
</script>