<template>
    <v-toolbar app color="white" prominent>
        <slot />
        <v-spacer />

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
            <user-field :label="'By User'" v-model="createdByUser" :multiple="false"/>
        </v-flex>

        <v-flex pl-3 xs3>
            <event-field :label="'Events'" v-model="belongingToEvent" :multiple="false" />
        </v-flex>
        <v-flex pl-3 xs3>
            <company-field :label="'Companies'" v-model="belongingToCompany" :multiple="false"/>
        </v-flex>
        <v-flex pl-3 xs3>
            <project-field :label="'Projects'" v-model="belongingToProject" :multiple="false"/>
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
    import EventField from '~/components/Fields/EventField.vue'
    import UserField from '~/components/Fields/UserField.vue'

    // import DateField from '~/components/Fields/DateField.vue'
    import DateRangeField from '~/components/Fields/DateRangeField.vue'


    export default {
        components: {ProjectField,CompanyField,DateRangeField,UserField,EventField},
        data: () => ({
            dateRange: [this.dateFrom,this.dateTo]
        }),
        computed: {
            belongingToProject: {
                get() { return this.$store.getters['note_list/belongingToProject'] },
                set(val) {
                    this.$store.commit('note_list/belongingToProject',val) 
                    this.refetchNotes()
                }
            },
            belongingToCompany: {
                get() { return this.$store.getters['note_list/belongingToCompany'] },
                set(val) {
                    this.$store.commit('note_list/belongingToCompany',val) 
                    this.refetchNotes()
                }
            },
            belongingToEvent: {
                get() { return this.$store.getters['note_list/belongingToEvent'] },
                set(val) {
                    this.$store.commit('note_list/belongingToEvent',val) 
                    this.refetchNotes()
                }
            },
            createdByUser: {
                get() { return this.$store.getters['note_list/createdByUser'] },
                set(val) {
                    this.$store.commit('note_list/createdByUser',val) 
                    this.refetchNotes()
                }
            },
            dateFrom: {
                get() { return this.$store.getters['note_list/dateFrom'] },
                set(val) { this.$store.commit('note_list/dateFrom',val) }
            },
            dateTo: {
                get() { return this.$store.getters['note_list/dateTo'] },
                set(val) { this.$store.commit('note_list/dateTo',val) }
            },
            search: {
                get() { return this.$store.getters['note_list/search']},
                set(val) {
                    this.$store.commit('note_list/search',val)
                    this.refetchNotes()
                }
            },
        },
        methods: {
            refetchNotes() {
                this.$store.dispatch('note_list/fetchNotes')
            }
        },
        watch: {
            // dateFrom (val) {
            //     this.refetchNotes()
            // },
            // dateTo (val) {
            //     this.refetchNotes()
            // },
            dateRange(val) {
                this.dateFrom = val[0]
                this.dateTo = val[1]
                this.refetchNotes()
            },
        }
    }
</script>