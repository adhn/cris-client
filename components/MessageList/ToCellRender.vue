<template>
<span>
    <template v-if="contactObjects">
        <template v-for="recipient in contactObjects"> 
            <!-- <v-btn :key=recipient.id flat :to="{ name: 'contacts-id', params: { id: recipient.id }}">
                    {{ recipient.display_name }}
            </v-btn> -->
            <router-link :key=recipient.id :to="{ name: 'contacts-id', params: { id: recipient.id }}">
                {{ recipient.display_name }}
            </router-link>
        </template>
    </template>
    <template v-if="contactStrings">
        <template v-for="str_recipient in contactStrings">
            <span :key="str_recipient"><br />{{str_recipient}}</span>
        </template>
    </template>
</span>
</template>

<script>

export default {
    props: ['message','contactObjects','contactStrings'],
    computed: {

    },
    methods: {

    }
}
</script>