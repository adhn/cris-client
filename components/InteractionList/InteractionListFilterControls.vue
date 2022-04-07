<template>
        <v-toolbar app color="white" prominent>
        <slot></slot>
        <v-spacer></v-spacer>
        <!-- <v-flex pl-3 xs3>
            <date-field :label="'Date From'" v-model="dateFrom" />
        </v-flex>
        <v-flex pl-3 xs3>
            <date-field :label="'Date To'" v-model="dateTo" />
        </v-flex> -->
        <v-flex pl-3 xs3>
            <date-range-field v-model="dateRange" :label="'Date range'" />
        </v-flex>
        <v-flex pl-3 xs3>
            <interaction-type-field :label="'Interaction Type'" v-model="belongingToInteractionType" />
        </v-flex>


        <v-flex pl-3 xs3>
            <contact-field :multiple="true" :label="'Contacts'" v-model="associatedWithContacts" />
        </v-flex>
        <v-flex pl-3 xs3>
            <company-field :multiple="true" :label="'Companies'" v-model="associatedWithCompanies" />
        </v-flex>
        <v-flex pl-3 xs3>
            <project-field :multiple="true"     :label="'Projects'" v-model="associatedWithProjects" />
        </v-flex>
        <v-flex pl-3 xs3>
            <event-field :multiple="true"     :label="'Events'" v-model="associatedWithEvents" />
        </v-flex>
        
        <v-flex pl-3 xs3>
            <v-text-field
                    append-icon="search"
                    label="Search"
                    v-model="search"
                    v-shortkey="['ctrl','f']"
                    ref="search"
                    @shortkey.native="$refs.search.focus()"
            ></v-text-field>
        </v-flex>
        
        </v-toolbar>
</template>
<script>
    import {mapGetters} from 'vuex'
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import CompanyField from '~/components/Fields/CompanyField.vue'
    import ContactField from '~/components/Fields/ContactField.vue'
    import EventField from '~/components/Fields/EventField.vue'
    import DateField from '~/components/Fields/DateField.vue'
    import DateRangeField from '~/components/Fields/DateRangeField.vue'


    import InteractionTypeField from '~/components/Fields/InteractionTypeField.vue'

    export default {
        components: {ProjectField,CompanyField,ContactField,InteractionTypeField,DateField,EventField,DateRangeField},
        data: () => ({
            dateRange: [this.dateFrom,this.dateTo]
        }),
        computed: {
            associatedWithProjects: {
                get() { return this.$store.getters['interaction_list/associatedWithProjects'] },
                set(val) {
                    this.$store.commit('interaction_list/associatedWithProjects',val) 
                    this.refetchInteractions()
                }
            },
            associatedWithCompanies: {
                get() { return this.$store.getters['interaction_list/associatedWithCompanies'] },
                set(val) {
                    this.$store.commit('interaction_list/associatedWithCompanies',val) 
                    this.refetchInteractions()
                }
            },
            associatedWithContacts: {
                get() { return this.$store.getters['interaction_list/associatedWithContacts'] },
                set(val) {
                    this.$store.commit('interaction_list/associatedWithContacts',val) 
                    this.refetchInteractions()
                }
            },
            associatedWithEvents: {
                get() { return this.$store.getters['interaction_list/associatedWithEvents'] },
                set(val) {
                    this.$store.commit('interaction_list/associatedWithEvents',val) 
                    this.refetchInteractions()
                }
            },
            belongingToInteractionType: {
                get() { return this.$store.getters['interaction_list/belongingToInteractionType'] },
                set(val) {
                    this.$store.commit('interaction_list/belongingToInteractionType',val) 
                    this.refetchInteractions()
                }
            },
            dateFrom: {
                get() { return this.$store.getters['interaction_list/dateFrom'] },
                set(val) { this.$store.commit('interaction_list/dateFrom',val) }
            },
            dateTo: {
                get() { return this.$store.getters['interaction_list/dateTo'] },
                set(val) { this.$store.commit('interaction_list/dateTo',val) }
            },
            search: {
                get() { return this.$store.getters['interaction_list/search']},
                set(val) {
                    this.$store.commit('interaction_list/search',val)
                    this.refetchInteractions()    
                }
            },
        },
        methods: {
            refetchInteractions() {
                this.$store.dispatch('interaction_list/fetchInteractions')
            },
        },
        watch: {
            dateRange(val) {
                this.dateFrom = val[0]
                this.dateTo = val[1]
                this.refetchInteractions()

            },
            // dateFrom (val) {
            //     this.refetchInteractions()
            // },
            // dateTo (val) {
            //     this.refetchInteractions()
            // },
        }
    }
</script>