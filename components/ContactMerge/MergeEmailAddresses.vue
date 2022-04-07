<template>
            <v-card>
                <v-card-title>
                    <h3>Email addresses</h3>
                </v-card-title>
                <v-card-text>
                <template v-for="(item,key) in contact.emailAddresses">
                    <v-layout v-bind:key="key" row wrap>
                        <v-flex xs1>                                            
                            <v-btn icon @click="copyEmail(item)"><v-icon>reply</v-icon></v-btn> 
                        </v-flex>
                        <v-flex xs6>
                                <v-text-field 
                                :value="item.address" 
                                label="Email" />
                        </v-flex>
                        <v-flex xs5>
                                <v-text-field 
                                :value="item.name"
                                label="Display Name" />
                        </v-flex>
                    </v-layout>
                </template>
                </v-card-text>
            </v-card>
</template>
<script>

    export default {
        props: ['contact'],
        components: {},
        data: () => ({

        }),
        computed: {

        },
        methods: {
            copyEmail(item) {
                // display_name, email <--- item.address,item.name
                let obj = {
                    display_name: item.name,
                    email: item.address
                } 
                this.$store.commit('contact/addEmailAddressAndSetValues',obj)
            }

        },
        mounted() {
        },
    }
</script>