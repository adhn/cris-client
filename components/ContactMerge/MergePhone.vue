<template>
    <v-card height="100%"> 
        <v-card-title>
            <h3>Phone</h3>
        </v-card-title>
        <v-card-text>
                    <merge-text-field fieldName="phones.business_phones.0" :label="'Business Phone 1'" :value="contact.businessPhones[0]" />
                    <merge-text-field fieldName="phones.business_phones.1" :label="'Business Phone 2'" :value="contact.businessPhones[1]" />
                    <merge-text-field fieldName="phones.home_phones.0" :label="'Home Phone 1'" :value="contact.homePhones[0]" />
                    <merge-text-field fieldName="phones.home_phones.1" :label="'Home Phone 2'" :value="contact.homePhones[1]" />
                    <merge-text-field fieldName="mobile_phone" :label="'Mobile Phone'" :value="contact.mobilePhone" />
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