<template>
<span>
    <template v-if="message.contact_from">
        <!-- <v-btn flat :to="{ name: 'contacts-id', params: { id: message.contact_from.id }}">
            {{ message.contact_from.display_name }}
        </v-btn> -->
        <router-link :to="{ name: 'contacts-id', params: { id: message.contact_from.id }}">
            {{ message.contact_from.display_name }}
        </router-link>
    </template>
    <template v-else>
        {{ message.from }}
    </template>
</span>
</template>

<script>

export default {
    props: ['message'],
    computed: {

    },
    methods: {

    }
}
</script>