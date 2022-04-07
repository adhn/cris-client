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



            
        <interaction-form-main-information class="mb-3" />
        

        <v-layout column class="fab-container">

                    <v-btn color="secondary" fab dark @click.native="close">
                        <v-icon>close</v-icon>
                    </v-btn>

                    <v-btn color="error" fab dark @click.native="deleteInteraction">
                        <v-icon>delete</v-icon>
                    </v-btn>

                    <v-btn class="" color="primary" fab dark @click.native="save()">
                        <v-icon>save</v-icon>
                    </v-btn>
        </v-layout>
</div>
</template>

<script>
    import InteractionFormMainInformation from '~/components/Interaction/InteractionFormMainInformation.vue'

    import {mapGetters} from 'vuex';
    export default {
        components: {InteractionFormMainInformation},
        methods: {
            save() {
                this.$store.dispatch('interaction/save')
            },
            deleteInteraction() {
                let answer = confirm("Are you sure you want to delete this interaction?\n\nIt will be soft-deleted and only an Admin will be able to restore it") 
                if(answer) {
                    Promise.all([
                        this.$store.dispatch('interaction/deleteInteraction',this.id)
                    ]).then(data => {
                        this.$router.push({ name: 'interactions'})
                    })
                }
            },
            edit() {
                    this.$router.push({ name: 'interactions-edit-id', params: { id: this.id }})
            },
            close() {
                if(this.id) {
                    this.$router.push({ name: 'interactions-id', params: { id: this.id }})
                } else {
                    this.$router.push({ name: 'interactions'})
                }
            }
        }, 
        computed: {
            ...mapGetters('interaction',['id','title']),
            
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