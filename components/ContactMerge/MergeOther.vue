<template>
    <v-card height="100%"> 
        <v-card-title>
            <h3>Other</h3>
        </v-card-title>
        <v-card-text>
            <merge-text-field fieldName="birthday" :label="'Birthday'" :value="contact.birthday" />
            <merge-text-field fieldName="nick_name" :label="'Nick Name'" :value="contact.nickName" />
            <merge-text-field fieldName="spouse_name" :label="'Spouse Name'" :value="contact.spouseName" />
        </v-card-text>
    </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';
    import MergeTextField from '~/components/ContactMerge/MergeTextField.vue';
    export default {
        components: {MergeTextField},
        props:['contact'],
        data: () => ({

        }),
        computed: {

        },
        methods: {

        },
        mounted() {
        },
    }
</script>