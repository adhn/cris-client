<template>
            <v-card flat>
                <v-card-title><h3>Work</h3></v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                            <v-flex xs4>
                                <v-text-field :disabled="readonly" v-model="job_title" label="Job title"></v-text-field>
                            </v-flex>
                            <v-flex xs4 pl-3>
                                <v-text-field :disabled="readonly" v-model="department" label="Department"></v-text-field>
                            </v-flex>
                            <v-flex xs4 pl-3>
                                <v-text-field :disabled="readonly" v-model="company_name" label="Company name"></v-text-field>
                            </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                            <v-flex xs4 >
                                <v-text-field :disabled="readonly" v-model="office_location" label="Office location"></v-text-field>
                            </v-flex>
                            <v-flex xs4 pl-3>
                                <v-text-field :disabled="readonly" v-model="manager" label="Manager"></v-text-field>
                            </v-flex>
                            <v-flex xs4 pl-3>
                                <v-text-field :disabled="readonly" v-model="assistant_name" label="Assistant name"></v-text-field>
                            </v-flex>
                    </v-layout>
                    <v-layout row wrap v-if="showYomiCompanyName">
                            <v-flex xs3>
                                <v-text-field :disabled="readonly" v-model="yomi_company_name" label="Yomi company name"></v-text-field>
                            </v-flex>
                    </v-layout>

                </v-card-text>
            </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        components: {},
        data: () => ({
        }),
        computed: {
            job_title: {
                get () { return this.$store.getters['contact/job_title'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',job_title: value})}
            },
            department: {
                get () { return this.$store.getters['contact/department'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',department: value})}
            },
            company_name: {
                get () { return this.$store.getters['contact/company_name'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',company_name: value})}
            },
            office_location: {
                get () { return this.$store.getters['contact/office_location'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',office_location: value})}
            },
            manager: {
                get () { return this.$store.getters['contact/manager'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',manager: value})}
            },
            assistant_name: {
                get () { return this.$store.getters['contact/assistant_name'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',assistant_name: value})}
            },
            yomi_company_name: {
                get () { return this.$store.getters['contact/yomi_company_name'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',yomi_company_name: value})}
            },
            ...mapGetters('contact',[
                'showYomiCompanyName',
                'readonly'
            ])
        },
        methods: {

        },
        mounted() {
        },
    }
</script>