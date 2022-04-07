<template>
    <v-layout row wrap>
        <slot></slot>
        <v-spacer></v-spacer>
        <v-flex pl-3 xs2>
            <date-field :label="'Date From'" v-model="dateFrom" />
        </v-flex>
        <v-flex pl-3 xs2>
            <date-field :label="'Date To'" v-model="dateTo" />
        </v-flex>
        <v-flex pl-3 xs2>
            <user-field :label="'By User'" v-model="createdByUser" :multiple="false"/>
        </v-flex>
        <v-flex pl-3 xs2>
            <company-field :label="'Companies'" v-model="associatedWithCompanies" :multiple="false"/>
        </v-flex>
        <v-flex pl-3 xs2>
            <project-field :label="'Projects'" v-model="associatedWithProjects" :multiple="false"/>
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
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import CompanyField from '~/components/Fields/CompanyField.vue'
    import UserField from '~/components/Fields/UserField.vue'

    import DateField from '~/components/Fields/DateField.vue'


    export default {
        components: {ProjectField,CompanyField,DateField,UserField},
        data: () => ({

        }),
        computed: {
            dateFrom: {
                get() { return this.$store.getters['audit_list/dateFrom'] },
                set(val) { this.$store.commit('audit_list/dateFrom',val) }
            },
            dateTo: {
                get() { return this.$store.getters['audit_list/dateTo'] },
                set(val) { this.$store.commit('audit_list/dateTo',val) }
            },
            search: {
                get() { return this.$store.getters['audit_list/search']},
                set(val) {this.$store.commit('audit_list/search',val)}
            },
            associatedWithProjects: {
                get() { return this.$store.getters['audit_list/associatedWithProjects'] },
                set(val) {
                    this.$store.commit('audit_list/associatedWithProjects',val) 
                    this.refetchAudits()
                }
            },
            associatedWithCompanies: {
                get() { return this.$store.getters['audit_list/associatedWithCompanies'] },
                set(val) {
                    this.$store.commit('audit_list/associatedWithCompanies',val) 
                    this.refetchAudits()
                }
            },
        },
        methods: {
            refetchAudits() {
                this.$store.dispatch('audit_list/fetchAudits')
            }
        },
        watch: {
            dateFrom (val) {
                this.refetchAudits()
            },
            dateTo (val) {
                this.refetchAudits()
            },
        }
    }
</script>