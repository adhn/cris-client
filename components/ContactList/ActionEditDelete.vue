<template>
    <div>
        <v-btn icon class="mx-0" :to="{ name: 'contacts-edit-id', params: { id: item.id }}">
            <v-icon color="teal">edit</v-icon>
        </v-btn>
        <v-btn icon class="mx-0" @click="deleteContact(item)">
            <v-icon color="pink">delete</v-icon>
        </v-btn>
    </div>
</template>
<script>
export default {
    props: ['item'],
    methods: {
            // editItem(item) {
            //     return this.$store.dispatch('contact/editContact',item)                
            // },

            deleteContact(item) {
                let answer = confirm("Are you sure you want to delete this item?\n\nIt will trigger the contact to also be deleted in you and your colleagues Personal Address Books in Outlook\n\nDeleted contacts can be restored at a later point") 
                if(answer) {
                    this.$store.dispatch('contact_list/deleteContact',item).then(response => {
                        this.$store.dispatch('contact_list/fetchContactsFromGraphQL').then(response => {
                            this.$store.dispatch('contact_list/fetchContactTrashedCount')
                        },error => {
                            console.info(error)
                        })
                    },error => {
                        console.info(error)
                    });
                }
            },
    }
}
</script>