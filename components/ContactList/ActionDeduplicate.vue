<template>
        <v-btn 
        :to="{ name: 'contacts-duplicates-merge-id', params: { id:item.id }}"
        v-if="item.duplicateContacts && item.duplicateContacts.length"
        icon class="mx-0">
            <v-badge color="red" left overlap>
                <span slot="badge">{{item.duplicateContacts.length}}</span>
                <v-icon x-large color="lighten-1" large>compare_arrows</v-icon>
            </v-badge>
        </v-btn>
</template>
<script>
export default {
    props: ['item'],
    methods: {

    },
    created: function() {
        console.info('ActionDeduplicate item.duplicateContacts',this.item.duplicateContacts)
    }
}
</script>