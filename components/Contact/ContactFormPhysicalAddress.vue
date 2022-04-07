<template>
    <div>
        <h4>{{title}}</h4>
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field :disabled="readonly" v-model="street" label="Street"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs6>
                <v-text-field :disabled="readonly" v-model="postal_code" label="Postal Code"></v-text-field>
            </v-flex>
            <v-flex pl-3 xs6>
                <v-text-field :disabled="readonly" v-model="city" label="City"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs6>
                <v-text-field :disabled="readonly" v-model="state" label="State"></v-text-field>
            </v-flex>
            <v-flex pl-3 xs6>
                <v-text-field :disabled="readonly" v-model="country_or_region" label="Country/Region"></v-text-field>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        components: {},
        props:{
            title: String,
            physicalAddressType: String // business_address, home_address or other_address
        },
        data: () => ({
            
        }),
        mounted() {
            console.info(this.title);
        },
        computed: {
            ...mapGetters('contact',[
                'readonly'
            ]),
            street: {
                get () { return this.$store.getters['contact/'+this.physicalAddressType].street },
                set (value) { this.$store.commit({
                    type: 'contact/updatePhysicalAddress',
                    physicalAddressType: this.physicalAddressType,
                    field: 'street',
                    value: value
                    })}
            },
            postal_code: {
                get () { return this.$store.getters['contact/'+this.physicalAddressType].postal_code },
                set (value) { this.$store.commit({
                    type: 'contact/updatePhysicalAddress',
                    physicalAddressType: this.physicalAddressType,
                    field: 'postal_code',
                    value: value
                    })}
            },
            city: {
                get () { return this.$store.getters['contact/'+this.physicalAddressType].city },
                set (value) { this.$store.commit({
                    type: 'contact/updatePhysicalAddress',
                    physicalAddressType: this.physicalAddressType,
                    field: 'city',
                    value: value
                    })}
            },
            state: {
                get () { return this.$store.getters['contact/'+this.physicalAddressType].state },
                set (value) { this.$store.commit({
                    type: 'contact/updatePhysicalAddress',
                    physicalAddressType: this.physicalAddressType,
                    field: 'state',
                    value: value
                    })}
            },
            country_or_region: {
                get () { return this.$store.getters['contact/'+this.physicalAddressType].country_or_region },
                set (value) { this.$store.commit({
                    type: 'contact/updatePhysicalAddress',
                    physicalAddressType: this.physicalAddressType,
                    field: 'country_or_region',
                    value: value
                    })}
            },
        },
    }
</script>