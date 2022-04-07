<template>
<div>
        <v-layout row mb-3>
            <template v-if="id">
                <v-flex xs12 class="mb-3">
                    <v-card>
                        <v-card-title>
                            <h2>{{title}}</h2>
                        </v-card-title>
                    </v-card>
                </v-flex>
            </template>
        </v-layout>
            
        <checklist-form-main-information class="mb-3" :title="title" />


        <v-layout column class="fab-container">
                <!-- <v-btn class="" color="secondary" fab dark :to="{name: 'projects-id'}">
                    <v-icon>close</v-icon>
                </v-btn> -->

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
    import ChecklistFormMainInformation from '~/components/Checklist/ChecklistFormMainInformation.vue'

    import {mapGetters} from 'vuex';
    export default {
        components: {ChecklistFormMainInformation},
        props: ['title'],
        methods: {
            save() {
                return this.$store.dispatch('checklist/save')
            },
            edit() {
                    this.$router.push({ name: 'checklists-edit-id', params: { id: this.id }})
            },
            close() {
                if(this.id) {
                    this.$router.push({ name: 'checklists-id', params: { id: this.id }})
                } else {
                    this.$router.push({ name: 'checklists'})
                }
            }
        }, 
        computed: {
            ...mapGetters('checklist',['id','name']),
            
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