<template>
<div>
        <v-layout row mb-3>
            <template v-if="id">
                <v-flex xs12 class="mb-3">
                    <v-card>
                        <v-card-title>
                            <h2>{{name}}</h2>
                        </v-card-title>
                    </v-card>
                </v-flex>
            </template>
        </v-layout>

        <!-- <event-form-details class="mb-3"/> -->


            
        <event-form-main-information class="mb-3" />
        
        
        <v-layout column class="fab-container">

                    <v-btn color="secondary" fab dark @click.native="close">
                        <v-icon>close</v-icon>
                    </v-btn>


                <v-btn class="" color="primary" fab dark @click.native="save()">
                    <v-icon>save</v-icon>
                </v-btn>
        </v-layout>
</div>
</template>

<script>
    import EventFormMainInformation from '~/components/Event/EventFormMainInformation.vue'
    // import EventFormDetails from '~/components/Event/EventFormDetails.vue'

    import {mapGetters} from 'vuex';
    export default {
        components: {EventFormMainInformation},
        methods: {
            save() {
                if(this.id) {
                    this.$store.dispatch('checklist/save')
                }
                this.$store.dispatch('event/save')
            },
            edit() {
                    this.$router.push({ name: 'events-edit-id', params: { id: this.id }})
            },
            close() {
                if(this.id) {
                    this.$router.push({ name: 'events-id', params: { id: this.id }})
                } else {
                    this.$router.push({ name: 'events'})
                }
            }
        }, 
        computed: {
            ...mapGetters('event',['id','name']),
            
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