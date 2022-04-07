<template>
<v-card height="100%"> 
    <v-card-title>
        <h3>Work</h3>
    </v-card-title>
    <v-card-text>
                <merge-text-field fieldName="job_title" :label="'Job Title'" :value="contact.jobTitle" />
                <merge-text-field fieldName="department" :label="'Department'" :value="contact.department" />
                <merge-text-field fieldName="company_name" :label="'Company Name'" :value="contact.companyName" />
                <merge-text-field fieldName="office_location" :label="'Office Location'" :value="contact.officeLocation" />
                <merge-text-field fieldName="manager" :label="'Manager'" :value="contact.manager" />
                <merge-text-field fieldName="assistant_name" :label="'Assistant Name'" :value="contact.assistantName" />
                <merge-text-field fieldName="yomi_company_name" :label="'Yomi Company Name'" :value="contact.yomiCompanyName" />
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