<template>
    <v-card height="100%"> 
        <v-card-title>
            <h3>{{contact.displayName}}</h3>
        </v-card-title>
        <v-card-text>
            <p>Merge the contact data from here to the first column</p>
            <merge-text-field fieldName="title" :label="'Title'" :value="contact.title" />
            <merge-text-field fieldName="given_name" :label="'First Name'" :value="contact.givenName" />
            <merge-text-field fieldName="middle_name" :label="'Middle Name'" :value="contact.middleName" />
            <merge-text-field fieldName="surname" :label="'Surname'" :value="contact.surname" />
            <merge-text-field fieldName="suffix" :label="'Suffix'" :value="contact.suffix" />
            <merge-text-field fieldName="yomi_given_name" :label="'Yomi First Name'" :value="contact.yomiGivenName" />
            <merge-text-field fieldName="yomi_surname" :label="'Yomi Surname'" :value="contact.yomiSurname" />
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