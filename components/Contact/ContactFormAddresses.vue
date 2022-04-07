<template>
            <v-card flat>
                <v-card-title><h3>Addresses</h3></v-card-title>
                <v-card-text>
                        <ContactFormPhysicalAddress v-if="this.businessAddress" title="Business" physical-address-type="businessAddress" />
                        <ContactFormPhysicalAddress v-if="this.homeAddress" title="Home" physical-address-type="homeAddress" />
                        <ContactFormPhysicalAddress v-if="this.otherAddress" title="Other" physical-address-type="otherAddress" />
                </v-card-text>
                <v-card-actions>
                    <v-menu offset-y>
                        <v-btn v-if="!readonly" slot="activator" fab outline small dark color="primary">
                            <v-icon>add</v-icon>
                        </v-btn>
                        <v-list>
                            <v-list-tile v-for="(item, index) in toggleFields" :key="index" @click="toggleField(item)">
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </v-card-actions>
            </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';
    import ContactFormPhysicalAddress from './ContactFormPhysicalAddress.vue'

    export default {
        components: {ContactFormPhysicalAddress},
        data: () => ({
            toggleFields: [
                {title:'Business Address',toggle:'showBusinessAddress',physicalAddressType: 'businessAddress'},
                {title:'Home Address',toggle:'showHomeAddress',physicalAddressType:'homeAddress'},
                {title:'Other Address',toggle:'showOtherAddress',physicalAddressType:'otherAddress'}
            ],
        }),
        computed: {
            ...mapGetters('contact',[
                'businessAddress',
                'homeAddress',
                'otherAddress',
                'readonly'
            ]),
            
        },
        methods: {
            toggleField(item) {
                if(!this[item.physicalAddressType]) {
                    this.$store.commit('contact/addPhysicalAddress',{
                        physicalAddressType: item.physicalAddressType
                    })
                } else {
                    this.$store.commit('contact/removePhysicalAddress',{
                        physicalAddressType: item.physicalAddressType
                    })
                }
                if(this.businessAddress) console.info('businessAddress',this.businessAddress)
                if(this.homeAddress) console.info('homeAddress',this.homeAddress)
                if(this.otherAddress) console.info('otherAddress',this.otherAddress)
            }
        }
    }
</script>
