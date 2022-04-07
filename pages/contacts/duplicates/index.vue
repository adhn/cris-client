<template>
<div>
    <v-layout row mb-3>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ count }} Duplicate contacts</span>
                </v-card-title>
                <v-card-text>
                    <p>
                    Duplicate contacts occur when you have contacts in your Personal Address Book in Outlook that has the same email address as contacts that are Auto-synced 
                    by CRIS.<br />
                    To make sure the Auto-synced contacts in CRIS has the correct and updated information pertaining to a contact please take some time to merge your duplicate personal 
                    contacts listed below, with the ones in the Auto-Sync folder.<br />
                    This is most easily done by simply copying your duplicate contacts into the Auto-Sync folder upon which Outlook will give you the opportunity to merge the contacts into ones
                    </p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-spacer />
    </v-layout>

        <template v-for="(item,index) in duplicate_contacts">
            <v-layout row mb-3 :key=index fill-height="">
                <v-flex xs3 height="100%">
                    <v-card height="100%"> 
                        <v-card-title>
                            <span class="headline">{{item.contact.display_name}}<br />
                            <EmailCellRender :item=item.contact :fieldName="'email'" />
                            </span>
                        </v-card-title>
                        <v-card-text>
                            You have {{item.duplicates.length}} duplicates of this <strong>Auto-Synced</strong> Contact<br />
                        </v-card-text>
                    </v-card>
                </v-flex>
                    <v-btn color="primary" :to="{ name: 'contacts-duplicates-merge-id', params: { id:item.contact.id }}">
                        <v-icon x-large class="pr-2 mr-1 ml-1" color="lighten-1" large>compare_arrows</v-icon>
                    </v-btn>
                <template v-for="duplicate in item.duplicates">
                    <v-flex xs3 ml-1 :key=duplicate.contact.id height="100%">
                            <v-card height="100%"> 
                                <v-card-title>
                                    <span class="headline">
                                        {{duplicate.contact.displayName}}<br />
                                        <EmailCellRender :item=duplicate.contact :fieldName="'address'" />
                                    </span>
                                </v-card-title>
                                <v-card-text>
                                    In folder: 
                                    <template v-if=duplicate.folder.displayName>{{duplicate.folder.displayName}}</template>
                                    <template v-else>{{duplicate.folder}}</template>
                                </v-card-text>
                            </v-card>
                    </v-flex>
                </template>
            </v-layout>
        </template>


</div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import EmailCellRender from '~/components/ContactList/EmailCellRender.vue'

    export default {
        components: {EmailCellRender},
        data: () => ({

        }),
        async fetch ({ store, params }) {
            return store.dispatch('duplicate_contacts/fetch')
        },
        computed: {
            ...mapGetters('duplicate_contacts',['count','duplicate_contacts'])

        },
        methods: {
        }
    }
</script>