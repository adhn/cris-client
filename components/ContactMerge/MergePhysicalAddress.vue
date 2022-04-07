<template>
    <div>

<v-layout row wrap>
    <v-flex xs1>
        <v-btn icon small @click="copyPhysicalAddress(physicalAddress)"><v-icon>reply</v-icon></v-btn>
    </v-flex>

    <v-flex xs11>
        <h4>{{title}}</h4>
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field :value="physicalAddress.street" label="Street"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs6>
                <v-text-field :value="physicalAddress.postalCode" label="Postal Code"></v-text-field>
            </v-flex>
            <v-flex pl-3 xs6>
                <v-text-field :value="physicalAddress.city" label="City"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs6>
                <v-text-field :value="physicalAddress.state" label="State"></v-text-field>
            </v-flex>
            <v-flex pl-3 xs6>
                <v-text-field :value="physicalAddress.countryOrRegion" label="Country/Region"></v-text-field>
            </v-flex>
        </v-layout>
    </v-flex>
</v-layout>

    </div>
</template>
<script>
    export default {
        components: {},
        props:['physicalAddress','title','physicalAddressType'],
        data: () => ({
            
        }),
        mounted() {
        },
        computed: {

        },
        methods: {
            copyPhysicalAddress(physicalAddress) {
                    let obj = {
                        street: physicalAddress.street,
                        postal_code: physicalAddress.postalCode,
                        city: physicalAddress.city,
                        state: physicalAddress.state,
                        country_or_region: physicalAddress.countryOrRegion
                    }
                    this.$store.commit('contact/addPhysicalAddressWithValues',{
                        physicalAddressType: this.physicalAddressType,
                        physicalAddress: obj
                    })
            }
        }
    }
</script>