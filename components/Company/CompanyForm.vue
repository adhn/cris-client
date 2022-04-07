<template>
<div>
        <contact-form-main-information />

        <v-layout column class="fab-container">
                <v-btn color="secondary" fab dark @click.native="close">
                    <v-icon>close</v-icon>
                </v-btn>

                <v-btn class="" color="primary" fab dark @click.native="save">
                    <v-icon>save</v-icon>
                </v-btn>
        </v-layout>
</div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import ContactFormMainInformation from '~/components/Company/CompanyFormMainInformation.vue'

    export default {
        components: {ContactFormMainInformation},
        data: () => ({

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