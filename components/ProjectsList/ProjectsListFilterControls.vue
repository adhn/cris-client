<template>
        <v-toolbar app color="white" prominent>
        <slot></slot>
        <v-spacer></v-spacer>
        <v-flex pl-3 xs2>
            <company-field :issuerCompaniesOnly="true" :label="'Issuer'" :multipe="false" v-model="issuer" />
        </v-flex>
        <v-flex pl-3 xs2>
            <v-select
                    :items="statuses"
                    v-model="active"
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
                    v-shortkey="['ctrl','f']"
                    ref="search"
                    @shortkey.native="$refs.search.focus()"
            ></v-text-field>
        </v-flex>
    </v-toolbar>
</template>
<script>
    import {mapGetters} from 'vuex';
    import CompanyField from '~/components/Fields/CompanyField.vue';

    export default {
        components: {CompanyField},
        data: () => ({
            statuses: [
                {value: true,name:'Active'},
                {value: false,name:'Archived'}
            ],
        }),
        computed: {
            // ...mapGetters('contact_list',['companies','filtersLoading','projects']),
            issuer: {
                get() { return this.$store.getters['project_list/associatedWithCompanyAsIssuer']},
                set(val) {
                    this.$store.commit('project_list/associatedWithCompanyAsIssuer',val)
                    this.refetchProjects();
                }
            },
            search: {
                get() { return this.$store.getters['project_list/search']},
                set(val) {
                    this.$store.commit('project_list/search',val)
                    this.refetchProjects();
                }
            },
            active: {
                get() { return this.$store.getters['project_list/active']},
                set(val) {
                    this.$store.commit('project_list/active',val)
                    this.refetchProjects();
                }
            }
        },
        methods: {
            refetchProjects() {
                this.$store.dispatch('project_list/fetchProjects')
            }
        }
    }
</script>