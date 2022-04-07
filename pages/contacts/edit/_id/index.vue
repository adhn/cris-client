<template>
<div>
        <v-layout row mb-3>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-spacer />
        </v-layout>

        <contact-form></contact-form>

        <v-layout column class="fab-container">
                <v-btn class="" color="secondary" fab dark @click.native="back">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-btn class="" color="primary" fab dark @click.native="save">
                    <v-icon>save</v-icon>
                </v-btn>
        </v-layout>
</div>
</template>
<script>
    import ContactForm from '~/components/Contact/ContactForm.vue'
    import {mapGetters} from 'vuex';

    export default {
        components: {ContactForm},
        async fetch({store,params}) {
            store.commit('contact/readonly',false)
            return Promise.all([
                store.dispatch('contact/fetchData'),
                store.dispatch('contact/editContact',params.id)
            ])
        },
        methods: {
            save() {
                this.$store.dispatch('contact/save').then(this.$store.dispatch('contact/refresh'))
            },
            back() {
                this.$router.go(-1)
            }
        },
        computed: {
            formTitle() {
                return this.$store.getters['contact/isNew'] ? 'New Contact' : ''+ this.editContactDisplayName
            },
            ...mapGetters('contact',['editContactDisplayName']),
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