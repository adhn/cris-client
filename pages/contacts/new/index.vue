<template>
<div>
        <v-layout row mb-3>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        <!-- <v-switch color="primary" :label="'Edit mode'" v-model="editable"></v-switch> -->
                    </v-card-title>
                    <v-card-text>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-spacer />
        </v-layout>

        <contact-form></contact-form>

        <v-layout column class="fab-container">
                <v-btn class="" color="secondary" fab dark :to="{name: 'contacts'}">
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
            store.commit('contact/reset')
            store.commit('contact/newContact')
            store.commit('contact/readonly',false)
            return store.dispatch('contact/fetchData')
        },
        methods: {
            save() {
                this.$store.dispatch('contact/save')
            }
        },
        computed: {
            formTitle() {
                return this.$store.getters['contact/isNew'] ? 'New Contact' : ''+ this.editContactDisplayName
            },
            ...mapGetters('contact',['editContactDisplayName']),
            editable: {
                get () { return !this.$store.getters['contact/readonly'] },
                set (value) { this.$store.commit('contact/readonly',!value)}
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