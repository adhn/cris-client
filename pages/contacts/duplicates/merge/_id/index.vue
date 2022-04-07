<template>
<div>
        <v-layout row fill-height="">
                        <v-flex xs5 height="100%" class="elevation-5 mr-3">
                            <v-card height="100%" > 
                                <v-card-title>
                                    <h3>Destination Contact</h3>
                                </v-card-title>
                                <v-card-text>
                                    <p>This is the contact that is already managed by CRIS</p>
                                    <p>When done merging the duplicates into this contact click the button below</p>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="primary" dark class="mb-2" @click.native="merge">Save destination contact and delete duplicates</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                        
                        <template v-if="firstDuplicateContact">
                        <v-flex xs3 height="100%">
                            <v-card height="100%" > 
                                <v-card-title>
                                    <h3>Duplicate contact #1</h3>
                                </v-card-title>
                                <v-card-text>
                                    <p>Use the arrows to copy information to the destination contact or edit the destination contact manually</p>
                                    <p><strong>This contact will be deleted upon clicking Merge</strong></p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        </template>

                        <template v-if="secondDuplicateContact">
                        <v-flex xs3 height="100%">
                            <v-card height="100%" > 
                                <v-card-title>
                                    <h3>Duplicate contact #2</h3>
                                </v-card-title>
                                <v-card-text>
                                    <p>Use the arrows to copy information to the destination contact or edit the destination contact manually</p>
                                    <p><strong>This contact will be deleted upon clicking Merge</strong></p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        </template>
        </v-layout>

        <v-spacer class="mb-3" />

        <v-layout row fill-height="">
                <v-flex xs5 height="100%" class="elevation-5 mr-3">
                    <v-card height="100%" > 
                        <v-card-title>
                            <h3>{{editContactDisplayName}}</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="title" label="Title"></v-text-field>
                            <v-text-field v-model="given_name" label="First Name"></v-text-field>
                            <v-text-field v-model="middle_name" label="Middle Name"></v-text-field>
                            <v-text-field v-model="surname" label="Surname"></v-text-field>
                            <v-text-field v-model="suffix" label="Suffix"></v-text-field>
                            <v-text-field v-model="yomi_given_name" label="Yomi First Name"></v-text-field>
                            <v-text-field v-model="yomi_surname" label="Yomi Surname"></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <template v-if="firstDuplicateContact">
                <v-flex xs3 height="100%">
                        <MergeName :contact="firstDuplicateContact" />
                </v-flex>
                </template>

                <template v-if="secondDuplicateContact">
                <v-flex xs3 height="100%">
                        <MergeName :contact="secondDuplicateContact" />
                </v-flex>
                </template>

        </v-layout>
        <v-spacer class="mb-3" />

        <v-layout row fill-height="">
                <v-flex xs5 height="100%"  class="elevation-5 mr-3">
                    <v-card height="100%"> 
                        <v-card-title>
                            <h3>Phone</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field :value="business_phones[0]" label="Business Phone 1"></v-text-field>
                            <v-text-field :value="business_phones[1]" label="Business Phone 2"></v-text-field>
                            <v-text-field :value="home_phones[0]" label="Home Phone 1"></v-text-field>
                            <v-text-field :value="home_phones[1]" label="Home Phone 2"></v-text-field>
                            <v-text-field v-model="mobile_phone" label="Mobile Phone"></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <template v-if="firstDuplicateContact">
                <v-flex xs3 height="100%">
                    <MergePhone :contact="firstDuplicateContact" />
                </v-flex>
                </template>

                <template v-if="secondDuplicateContact">
                    <v-flex xs3 height="100%">
                        <MergePhone :contact="secondDuplicateContact" />
                    </v-flex>
                </template>
        </v-layout>
        <v-spacer class="mb-3" />

        <v-layout row fill-height="">
                <v-flex xs5 height="100%"  class="elevation-5 mr-3">
                    <v-card height="100%"> 
                        <v-card-title>
                            <h3>Work</h3>
                        </v-card-title>
                        <v-card-text>
                                <v-text-field v-model="job_title" label="Job Title"></v-text-field>
                                <v-text-field v-model="department" label="Department"></v-text-field>
                                <v-text-field v-model="company_name" label="Company Name"></v-text-field>
                                <v-text-field v-model="office_location" label="Office Location"></v-text-field>
                                <v-text-field v-model="manager" label="Manager"></v-text-field>
                                <v-text-field v-model="assistant_name" label="Assistant Name"></v-text-field>
                                <v-text-field v-model="yomi_company_name" label="Yomi Company Name"></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <template v-if="firstDuplicateContact">
                <v-flex xs3 height="100%">
                    <MergeWork :contact="firstDuplicateContact"/>
                </v-flex>
                </template>
                
                <template v-if="secondDuplicateContact">
                <v-flex xs3 height="100%">
                    <MergeWork :contact="secondDuplicateContact"/>
                </v-flex>
                </template>
        </v-layout>
        <v-spacer class="mb-3" />

        <v-layout row fill-height="">
                <v-flex xs5 height="100%"  class="elevation-5 mr-3">
                    <v-card height="100%"> 
                        <v-card-title>
                            <h3>Other</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="birthday" label="Birthday"></v-text-field>
                            <v-text-field v-model="nick_name" label="Nick Name"></v-text-field>
                            <v-text-field v-model="spouse_name" label="Spouse Name"></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <template v-if="firstDuplicateContact">
                <v-flex xs3 height="100%">
                    <MergeOther :contact="firstDuplicateContact" />
                </v-flex>
                </template>

                <template v-if="secondDuplicateContact">
                <v-flex xs3 height="100%">
                    <MergeOther :contact="secondDuplicateContact" />
                </v-flex>
                </template>
        </v-layout>
        <v-spacer class="mb-3" />


        <v-layout row fill-height="">
                <v-flex xs5 height="100%"  class="elevation-5 mr-3">
                    <v-card height="100%"> 
                        <v-card-title>
                            <h3>Personal Notes</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="personal_notes" label="Personal Notes"></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <template v-if="firstDuplicateContact">
                    <v-flex xs3 height="100%">
                        <MergeNotes :contact="firstDuplicateContact" />
                    </v-flex>
                </template>

                <template v-if="secondDuplicateContact">
                    <v-flex xs3 height="100%">
                        <MergeNotes :contact="secondDuplicateContact" />
                    </v-flex>
                </template>
        </v-layout>
        <v-spacer class="mb-3" />


        <v-layout row fill-height="">
            <v-flex xs5 height="100%" class="elevation-5 mr-3">
                <contact-form-email />
            </v-flex>
            
            <template v-if="firstDuplicateContact">
                <template v-if="firstDuplicateContact.emailAddresses">
                    <v-flex xs3 height="100%">
                        <MergeEmailAddresses :contact="firstDuplicateContact" />
                    </v-flex>
                </template>
            </template>


            <template v-if="secondDuplicateContact">
                <template v-if="secondDuplicateContact.emailAddresses">
                    <v-flex xs3 height="100%">
                        <MergeEmailAddresses :contact="secondDuplicateContact" />
                    </v-flex>
                </template>
            </template>
        </v-layout>
        <v-spacer class="mb-3" />


        <v-layout row fill-height="">
            
            <v-flex xs5 height="100%" class="elevation-5 mr-3">
                <ContactFormAddresses />
            </v-flex>

            <v-flex xs3 height="100%">
                <template v-if="firstDuplicateContact">
                    <MergeAddresses :contact="firstDuplicateContact"/>
                </template>
            </v-flex>
            
            <v-flex xs3 height="100%">
                <template v-if="secondDuplicateContact">
                    <MergeAddresses :contact="secondDuplicateContact"/>
                </template>
            </v-flex>
        
        </v-layout>
        <v-spacer class="mb-3" />



        <v-layout row fill-height="">
            <v-flex xs5 height="100%" class="elevation-5 mr-3">
                <ContactFormIM />
            </v-flex>

            <v-flex xs3 height="100%">
                <template v-if="firstDuplicateContact">
                    <MergeIM :contact="firstDuplicateContact"/>
                </template>
            </v-flex>

            <v-flex xs3 height="100%">
                <template v-if="secondDuplicateContact">
                    <MergeIM :contact="secondDuplicateContact"/>
                </template>
            </v-flex>
        </v-layout>
        <v-spacer class="mb-3" />
</div>
</template>
<script>

    import {mapGetters} from 'vuex';
    import MergeName from '~/components/ContactMerge/MergeName.vue';
    import MergeTextField from '~/components/ContactMerge/MergeTextField.vue';
    import ContactFormEmail from '~/components/Contact/ContactFormEmail.vue';
    import ContactFormAddresses from '~/components/Contact/ContactFormAddresses.vue';
    import MergeAddresses from '~/components/ContactMerge/MergeAddresses.vue';
    import ContactFormIM from '~/components/Contact/ContactFormIM.vue';
    import MergeIM from '~/components/ContactMerge/MergeIM.vue';
    import MergeEmailAddresses from '~/components/ContactMerge/MergeEmailAddresses.vue';
    import MergeWork from '~/components/ContactMerge/MergeWork.vue';
    import MergePhone from '~/components/ContactMerge/MergePhone.vue';
    import MergeOther from '~/components/ContactMerge/MergeOther.vue';
    import MergeNotes from '~/components/ContactMerge/MergeNotes.vue';


    export default {
        components: {
            MergeTextField,
            ContactFormEmail,
            ContactFormAddresses,
            MergeAddresses,
            ContactFormIM,
            MergeIM,
            MergeEmailAddresses,
            MergeName,
            MergeWork,
            MergePhone,
            MergeOther,
            MergeNotes
        },
        data: () => ({
            textFields: {
                'title':'Title',
                'given_name': 'First Name',
                'middle_name': 'Middle Name',
                'surname': 'Surname',
                'suffix': 'Suffix',
                'yomi_given_name':'Yomi Given Name',
                'yomi_surname':'Yomi Surname'
            },
            contactId: null,
            duplicates: null, // is array with objects and properties folder,contacts
            firstDuplicateContact: null,
            secondDuplicateContact: null,

        }),
        computed: {
            ...mapGetters('contact',['editContactDisplayName']),
            ...mapGetters('duplicate_contacts',['duplicateContacts']),

            given_name: {
                get () { return this.$store.getters['contact/given_name'] },
                set (value) { 
                    console.info('given name')
                    this.$store.commit({type: 'contact/updateContact',given_name: value})
                }
            },
            surname: {
                get () { return this.$store.getters['contact/surname']  },
                set (value) { this.$store.commit({type: 'contact/updateContact',surname: value})}
            },
            middle_name: {
                get () { return this.$store.getters['contact/middle_name']  },
                set (value) { this.$store.commit({type: 'contact/updateContact',middle_name: value})}
            },
            title: {
                get () { return this.$store.getters['contact/title']  },
                set (value) { this.$store.commit({type: 'contact/updateContact',title: value})}
            },
            suffix: {
                get () { return this.$store.getters['contact/suffix']  },
                set (value) { this.$store.commit({type: 'contact/updateContact',suffix: value})}
            },
            yomi_given_name: {
                get () { return this.$store.getters['contact/yomi_given_name']  },
                set (value) { this.$store.commit({ type: 'contact/updateContact', yomi_given_name: value})}
            },
            yomi_surname: {
                get () { return this.$store.getters['contact/yomi_surname'] },
                set (value) { this.$store.commit({ type: 'contact/updateContact', yomi_surname: value})}
            },

            // phones
            ...mapGetters('contact',[
                'business_phones',
                'home_phones'
            ]),
            mobile_phone: {
                get() {return this.$store.getters['contact/mobile_phone']},
                set(val) {this.$store.commit('contact/mobile_phone',val)}
            },
            updatePhone(field,key,e) {
                this.$store.commit('contact/updatePhone',{
                    field: field,
                    key: key,
                    value: e
                })
            },
            // work
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

            // other

            birthday: {
                get () { return this.$store.getters['contact/birthday'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',birthday: value})}
            },
            nick_name: {
                get () { return this.$store.getters['contact/nick_name'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',nick_name: value})}
            },
            spouse_name: {
                get () { return this.$store.getters['contact/spouse_name'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',spouse_name: value})}
            },

            // notes

            personal_notes: {
                get () { return this.$store.getters['contact/personal_notes'] },
                set (value) { this.$store.commit({type: 'contact/updateContact',personal_notes: value})}
            },

        },
        methods: {
            merge() {
                this.$store.dispatch('contact/save').then(resp => {
                    this.$store.dispatch('duplicate_contacts/deleteCurrentDuplicates')
                })
            }
        },
        async fetch({ store, params }) {
            store.commit('duplicate_contacts/currentlyMergingContactId',params.id)
            return Promise.all([
                store.dispatch('contact/editContact',params.id),
                store.dispatch('duplicate_contacts/fetch')
            ])
        },
        created() {
            // created life cycle hooks run after the Promises in fetch have been resolved
            if(this.duplicateContacts[0]) {
                this.firstDuplicateContact = this.duplicateContacts[0]
            }
            if(this.duplicateContacts[1]) {
                this.secondDuplicateContact = this.duplicateContacts[1]
            }
        },
    }
</script>