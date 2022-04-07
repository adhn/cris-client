<template>
<span>
    <template v-for="attachment in attachments">
        <!-- <router-link :key="'attachment-'+attachment.id" :to="{ name: 'attachments-id', params: { id: attachment.id }}" target= '_blank'>
            {{ attachment.name }}
        </router-link>  -->
        <a :key="'attachment-'+attachment.id" :href="'/attachments/'+attachment.graph_id" target='_blank'>{{ attachment.name }}</a> {{attachment.size | human-file-size}}<br :key="'br-'+attachment.id" />
    </template>
</span>
</template>

<script>

export default {
    props: ['attachments'],
    computed: {

    },
    methods: {

    }
}
</script>