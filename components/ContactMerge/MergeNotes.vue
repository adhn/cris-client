<template>
    <v-card height="100%"> 
        <v-card-title>
            <h3>Personal Notes</h3>
        </v-card-title>
        <v-card-text>
            <merge-text-field fieldName="personal_notes" :label="'Personal Notes'" :value="contact.personalNotes" />
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