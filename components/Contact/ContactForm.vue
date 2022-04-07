<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs5>
                <ContactFormName class="mb-3 elevation-2"></ContactFormName>
                <ContactFormEmail class="mb-3 elevation-2"></ContactFormEmail>
                <ContactFormWork class="mb-3 elevation-2"></ContactFormWork>
                <ContactFormOther class="mb-3 elevation-2"></ContactFormOther>
                <ContactFormIM class="mb-3 elevation-2"></ContactFormIM>
                <ContactFormNotes class="mb-3 elevation-2"></ContactFormNotes>
            </v-flex>
            <v-spacer />
            <v-flex xs6>
                <ContactFormProject class="mb-3 elevation-2" />
                <ContactFormCompany class="mb-3 elevation-2" />
                <ContactFormPhone class="mb-3 elevation-2"></ContactFormPhone>
                <ContactFormAddresses class="mb-3 elevation-2"></ContactFormAddresses>
                
            </v-flex>
        </v-layout>
</template>
<script>
    // import { createNamespacedHelpers } from 'vuex'

    import ContactFormName from './ContactFormName.vue';
    import ContactFormEmail from './ContactFormEmail.vue';
    import ContactFormPhone from './ContactFormPhone.vue';
    import ContactFormIM from './ContactFormIM.vue';
    import ContactFormWork from './ContactFormWork.vue';
    import ContactFormAddresses from './ContactFormAddresses.vue';
    import ContactFormOther from './ContactFormOther.vue';
    import ContactFormNotes from './ContactFormNotes.vue';
    import ContactFormProject from './ContactFormProject.vue';
    import ContactFormCompany from './ContactFormCompany.vue';
    
    export default {
        components: {
            ContactFormName,
            ContactFormEmail,
            ContactFormPhone,
            ContactFormIM,
            ContactFormWork,
            ContactFormAddresses,
            ContactFormOther,
            ContactFormNotes,
            ContactFormProject,
            ContactFormCompany
        },
        data: () => ({

        }),
        methods: {

        },
        computed: {

        }
    }
</script>