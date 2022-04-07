<template>
    <div>

        <event-list-filter-controls>
            <v-flex xs1>
                <v-btn v-shortkey="['insert']" @shortkey.native="$router.push({name: 'events-new'})" :to="{name: 'events-new'}" color="primary" dark class="mb-2">New Event</v-btn>
            </v-flex>
        </event-list-filter-controls>


        <event-list class="elevation-10" />

        <v-layout row wrap>
            <EventTrashedCountButton v-if="isAdmin" class="ml-0" :to="{ name: 'events-trashed' }" />
            <v-btn style="display:none" v-shortkey="['esc']" @shortkey.native="resetFilters()"></v-btn>
        </v-layout>
    </div>
</template>
<script>
    import EventList from '~/components/EventList/EventList.vue';
    import EventListFilterControls from '~/components/EventList/EventListFilterControls.vue';
    import EventTrashedCountButton from '~/components/EventList/EventTrashedCountButton.vue';
    import {mapGetters} from 'vuex';

    export default {
        components: { EventList,EventListFilterControls,EventTrashedCountButton},
        fetch ({ store, params }) {
            return Promise.all([
                store.dispatch('event_list/fetchEvents'),
                store.dispatch('event_type_field/fetchEventTypes'),
                store.dispatch('project_field/fetchProjects'),
                store.dispatch('company_field/fetchIssuerCompanies'),

            ])
        },
        created() {

        },
        methods: {
            resetFilters() {
                this.$store.commit('event_list/resetFilters')
                this.$store.dispatch('event_list/fetchEvents')
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