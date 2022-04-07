<template>
    <v-layout row wrap>
        <slot></slot>
        <v-spacer></v-spacer>
        <v-flex pl-3 xs2>
            <company-field :issuerCompaniesOnly="true" :label="'Client'" :multipe="false" v-model="associatedWithCompanies" />
        </v-flex>

        <v-flex pl-3 xs2>
            <project-field :label="'Project'" :multipe="true" v-model="associatedWithProjects" />
        </v-flex>


        <v-flex pl-3 xs2>
            <event-type-field :label="'Event Type'" :multipe="false" v-model="eventType" />
        </v-flex>

        <v-flex pl-3 xs2>
            <v-select
                    :items="statuses"
                    v-model="status"
                    persistent-hint
                    label="Status"
                    single-line
                    item-value="value"
                    item-text="name"
                    v-bind:clearable="false"
            ></v-select>
        </v-flex>
        <v-flex pl-3 xs2>
            <v-text-field
                    append-icon="search"
                    label="Search"
                    v-model="search"
            ></v-text-field>
        </v-flex>
    </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex'
    import CompanyField from '~/components/Fields/CompanyField.vue'
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import EventTypeField from '~/components/Fields/EventTypeField.vue'
    export default {
        components: {CompanyField,ProjectField,EventTypeField},
        data: () => ({
            statuses: [
                {value: 'ACTIVE',name:'Active'},
                {value: 'ARCHIVED',name:'Archived'}
            ],
            issuer: null
        }),
        computed: {
            search: {
                get() { return this.$store.getters['event_list/search']},
                set(val) {
                    this.$store.commit('event_list/search',val)
                    this.refetchEvents();
                }
            },
            status: {
                get() { return this.$store.getters['event_list/status']},
                set(val) {
                    this.$store.commit('event_list/status',val)
                    this.refetchEvents();
                }
            },
            associatedWithProjects: {
                get() { return this.$store.getters['event_list/associatedWithProjects']},
                set(val) {
                    this.$store.commit('event_list/associatedWithProjects',[parseInt(val)])
                    this.refetchEvents();
                }
            },
            associatedWithCompanies: {
                get() { return this.$store.getters['event_list/associatedWithCompanies']},
                set(val) {
                    this.$store.commit('event_list/associatedWithCompanies',[parseInt(val)])
                    this.refetchEvents();
                }
            },
            eventType: {
                get() { return this.$store.getters['event_list/eventType']},
                set(val) {
                    this.$store.commit('event_list/eventType',val)
                    this.refetchEvents();
                }
            },

        },
        methods: {
            refetchEvents() {
                this.$store.dispatch('event_list/fetchEvents')
            }
        }
    }
</script>