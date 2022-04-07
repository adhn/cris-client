<template>
    <div>
        <!-- Interaction Table controls -->

            <interaction-list-filter-controls>
                <v-flex xs1>
                    <v-btn v-shortkey="['insert']" @shortkey.native="$router.push({name: 'interactions-new'})" :to="{name: 'interactions-new'}" color="primary" dark class="mb-2">New Interaction</v-btn>
                </v-flex>
            </interaction-list-filter-controls>

        <!-- Interaction Table -->
        <interaction-list class="elevation-10" />

        <v-layout row wrap>
            <InteractionTrashedCountButton v-if="isAdmin" class="ml-0" :to="{ name: 'interactions-trashed' }" />
            <v-btn style="display:none" v-shortkey="['esc']" @shortkey.native="resetFilters()"></v-btn>
        </v-layout>

    </div>
</template>
<script>
    import InteractionList from '~/components/InteractionList/InteractionList.vue';
    import InteractionListFilterControls from '~/components/InteractionList/InteractionListFilterControls.vue';
    import InteractionTrashedCountButton from '~/components/InteractionList/InteractionTrashedCountButton.vue';
    import {mapGetters} from 'vuex';

    export default {
        components: { InteractionList,InteractionListFilterControls,InteractionTrashedCountButton},
        fetch ({ store, params }) {
            return Promise.all([
                store.dispatch('interaction_list/fetchInteractions'),
                store.dispatch('project_field/fetchProjects'),
                store.dispatch('company_field/fetchCompanies'),
                store.dispatch('contact_field/fetchContacts'),
                store.dispatch('event_field/fetchEvents'),
                store.dispatch('interaction_type_field/fetchInteractionTypes')


            ])
        },
        created() {

        },
        methods: {
            resetFilters() {
                this.$store.commit('interaction_list/resetFilters')
                this.$store.dispatch('interaction_list/fetchInteractions')
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