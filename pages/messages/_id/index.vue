<template>
<div>
    <v-layout row mb-3>
        <v-flex xs12>
            <h1>
            {{message.subject}}
            </h1>
        </v-flex>
    </v-layout>

    <v-layout row mb-3>
        <v-flex xs1>
            From:
        </v-flex>
        <v-flex xs10>
            <from-cell-render :message="message" />
        </v-flex>
    </v-layout>

    <v-layout row mb-3>
        <v-flex xs1>
            To:
        </v-flex>
        <v-flex xs10>
            <to-cell-render :contactObjects="message.contact_to_recipients" :contactStrings="message.to_recipients" />
        </v-flex>
    </v-layout>

    <v-layout row mb-3>
        <v-flex xs1>
            CC:
        </v-flex>
        <v-flex xs10>
            <to-cell-render :contactObjects="message.contact_cc_recipients" :contactStrings="message.cc_recipients" />
        </v-flex>
    </v-layout>

    <v-layout row mb-3>
        <message-content :bodyContent="message.body_content" />
    </v-layout>
</div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import FromCellRender from '~/components/MessageList/FromCellRender.vue'
    import ToCellRender from '~/components/MessageList/ToCellRender.vue'
    import MessageContentIframe from '~/components/Message/MessageContentIframe.vue'
    export default {
        layout: 'bare',
        components: {FromCellRender,ToCellRender,MessageContentIframe},
        async fetch({ store, params }) {
            return store.dispatch('message/fetch',params.id)
        },
        computed: {
            ...mapGetters('message',['message','messageLoading']),
        },
        methods: {

        },
    }

</script>