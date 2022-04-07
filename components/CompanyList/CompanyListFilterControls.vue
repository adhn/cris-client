<template>
        <v-toolbar app color="white">

        <slot></slot>
        <v-spacer></v-spacer>
        <v-flex pl-3 xs1>
            <v-checkbox label="Is Client?" v-model="isClient" />
        </v-flex>

        <v-flex pl-3 xs2>
            <v-select
                    ref="projectStatus"
                    :items="projectStatuses"
                    v-model="selectedStatus"
                    persistent-hint
                    label="Client Status"
                    single-line
                    item-value="id"
                    item-text="name"
                    :clearable="true"
            ></v-select>
        </v-flex>
        <v-flex pl-3 xs2>
            <project-role-field :label="'Project Role'" v-model="selectedProjectRoles" :multiple="true" :filtered="false" :clearable="true" />
        </v-flex>
        <v-flex pl-3 xs2>
            <project-field :label="'Project'" :multiple="true" :clearable="true" v-model="selectedProjects" />
        </v-flex>
        <v-flex pl-3 xs2>
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
    import ProjectRoleField from '~/components/Fields/ProjectRoleField.vue'
    import ProjectField from '~/components/Fields/ProjectField.vue'

    export default {
        components: {ProjectRoleField,ProjectField},
        data: () => ({
            projectStatuses: [
                {id: 'ACTIVE',name:'Active'},
                {id: 'PROSPECT',name:'Prospect'},
                {id: 'ARCHIVED',name:'Archived'}
            ],
        }),
        computed: {
            // ...mapGetters('contact_list',['companies','filtersLoading','projects']),
            // ...mapGetters('project_list',['companies','filtersLoading','projects']),
            selectedProjects: {
                get() { return this.$store.getters['company_list/selectedProjects'] },
                set(val) {
                    this.$store.commit('company_list/selectedProjects',val) 
                    this.refetchCompanies()
                }
            },
            selectedProjectRoles: {
                get() { return this.$store.getters['company_list/selectedProjectRoles'] },
                set(val) {
                    this.$store.commit('company_list/selectedProjectRoles',val) 
                    this.refetchCompanies()
                }
            },
            search: {
                get() { return this.$store.getters['company_list/search']},
                set(val) {
                    this.$store.commit('company_list/search',val)
                    this.refetchCompanies()

                }
            },
            isClient: {
                get() { return this.$store.getters['company_list/isClient']},
                set(val) {
                    this.$store.commit('company_list/isClient',val)
                    this.refetchCompanies()

                }
            },
            selectedStatus: {
                get() { return this.$store.getters['company_list/status']},
                set(val) {
                    this.$store.commit('company_list/status',val)
                    this.refetchCompanies()
                }
            },
        },
        methods: {
            refetchCompanies() {
                this.$store.dispatch('company_list/fetchCompanies')
            },
        }

    }
</script>