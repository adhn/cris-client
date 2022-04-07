<template>
    <div>
        <!-- Contact Table controls -->

        <ContactListFilterControls>
            <v-flex xs1>
                <v-btn v-shortkey="['insert']" @shortkey.native="$router.push({name: 'contacts-new'})" :to="{name: 'contacts-new'}" color="primary" dark class="mb-2">New Contact</v-btn>
            </v-flex>
        </ContactListFilterControls>

        <!-- Contact Table -->
        <ContactList class="elevation-10"></ContactList>

        <!-- Contact Table Footer controls -->
        <v-layout row wrap>
            <ContactTrashedCountButton v-if="isAdmin" class="ml-0" :to="{ name: 'contacts-trashed' }" />
            <!-- <ContactDuplicateCountButton class="ml-0" :to="{ name: 'contacts-duplicates' }" /> -->
            <v-btn style="display:none" v-shortkey="['esc']" @shortkey.native="resetFilters()"></v-btn>

        </v-layout>
    </div>
</template>
<script>
    import ContactList from '~/components/ContactList/ContactList.vue';
    import ContactTrashedCountButton from '~/components/ContactList/ContactTrashedCountButton.vue';
    // import ContactDuplicateCountButton from '~/components/ContactList/ContactDuplicateCountButton.vue';
    import ContactListFilterControls from '~/components/ContactList/ContactListFilterControls.vue';
    // import ContactForm from '~/components/Contact/ContactForm.vue';
    import {mapGetters} from 'vuex';

    export default {
        components: { ContactList,ContactTrashedCountButton,ContactListFilterControls},
        fetch ({ store, params }) {
            return Promise.all([
                store.dispatch('project_role_field/fetchProjectRoles'),
                store.dispatch('contact_list/fetchData'),
            ])
        },
        created() {

        },
        methods: {
            resetFilters() {
                this.$store.commit('contact_list/resetFilters')
                this.$store.dispatch('contact_list/fetchData')
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if(vm.$route.query.reset) {
                    vm.resetFilters()
                }
            })
        }, 
        computed: {
            ...mapGetters('auth',['isAdmin'])
        },
        watch: {
            '$route' (to, from) {
                if(this.$route.params.reset) {
                    this.resetFilters()
                }
            }
        }
    }
</script>