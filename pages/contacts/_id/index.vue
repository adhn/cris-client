<template>
<div>
    <v-toolbar app color="white" prominent>

                        <span class="headline">{{ formTitle }}</span>
                        <!-- <v-switch color="primary" :label="'Edit mode'" v-model="editable"></v-switch> -->
                        <v-spacer />
                        <v-btn color="error" @click="deleteContact(id)">Delete</v-btn>
                        <v-btn color="primary" :to="{ name: 'contacts-edit-id', params: { id: editContactId }}">Edit</v-btn>
    </v-toolbar>


        <contact-form></contact-form>

        <!-- <v-layout column class="fab-container">
                <v-btn class="" color="secondary" fab dark :to="{name: 'contacts'}">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-btn class="" color="primary" fab dark @click.native="save">
                    <v-icon>save</v-icon>
                </v-btn>
        </v-layout> -->
</div>
</template>
<script>
    import ContactForm from '~/components/Contact/ContactForm.vue'
    import {mapGetters} from 'vuex';

export default {
    components: {ContactForm},
    async fetch({ store, params }) {
        // store.commit('contact/reset')
        store.dispatch('contact/fetchData')
        store.dispatch('contact/editContact',params.id)
        store.commit('contact/readonly',true)

    },
    methods: {
        save() {
            this.$store.dispatch('contact/save')
        },
        deleteContact(item) {
            let answer = confirm("Are you sure you want to delete this item?\n\nIt will trigger the contact to also be deleted in you and your colleagues Personal Address Books in Outlook\n\nDeleted contacts can be restored at a later point") 
            if(answer) {
                let that = this
                this.$store.dispatch('contact_list/deleteContact',item).then(response => {
                    that.$router.push('/contacts')
                })
            }
        },
    },
    computed: {
        formTitle() {
            return this.$store.getters['contact/isNew'] ? 'New Contact' : ''+ this.editContactDisplayName
        },
        ...mapGetters('contact',['editContactDisplayName','editContactId']),
        // editable: {
        //     get () { return !this.$store.getters['contact/readonly'] },
        //     set (value) { this.$store.commit('contact/readonly',!value)}
        // },
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