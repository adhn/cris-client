<template>
            <v-card height="100%">
                <v-card-title><h3>Addresses</h3></v-card-title>
                <v-card-text>
                        <MergePhysicalAddress v-if="contact.businessAddress" :physicalAddress="contact.businessAddress" :physicalAddressType="'businessAddress'" title="Business" />
                        <MergePhysicalAddress v-if="contact.homeAddress" :physicalAddress="contact.homeAddress" :physicalAddressType="'homeAddress'" title="Home"  />
                        <MergePhysicalAddress v-if="contact.otherAddress" :physicalAddress="contact.otherAddress" :physicalAddressType="'otherAddress'" title="Other" />
                </v-card-text>
            </v-card>
</template>
<script>
    import MergePhysicalAddress from './MergePhysicalAddress.vue'

    export default {
        components: {MergePhysicalAddress},
        props: ['contact'],
        data: () => ({

        }),
        computed: {

            
        },
        methods: {

        }
    }
</script>