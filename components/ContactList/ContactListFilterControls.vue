<template>
        <v-toolbar app color="white" prominent>

        <slot></slot>
        <v-spacer></v-spacer>
        <v-flex xs2>
            <v-checkbox v-model="hasDuplicates" :label="`Only duplicates`"></v-checkbox>
        </v-flex>
        <v-flex xs2>
            <v-select
                    ref="companySelect"
                    :items="companies"
                    v-model="selectedCompanies"
                    label="Companies"
                    single-line
                    multiple
                    
                    persistent-hint
                    item-value="id"
                    item-text="name"
                    v-bind:loading="filtersLoading"
                    v-bind:clearable="true"
            ></v-select>
        </v-flex>

        <v-flex pl-3 xs2>
            <v-select
                    ref="projectSelect"
                    :items="projects"
                    v-model="selectedProjects"
                    multiple
                    persistent-hint
                    label="Projects"
                    single-line
                    item-value="id"
                    item-text="name"
                    v-bind:loading="filtersLoading"
                    v-bind:clearable="true"
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
    export default {

        data: () => ({

        }),
        computed: {
            ...mapGetters('contact_list',['companies','filtersLoading','projects']),
            hasDuplicates: {
                get() { return this.$store.getters['contact_list/hasDuplicates']},
                set(val) { 
                    this.$store.commit('contact_list/hasDuplicates',val)
                    this.refetchContacts()
                }
            },
            selectedCompanies: {
                get() { return this.$store.getters['contact_list/selectedCompanies']},
                set(val) { 
                    this.$store.commit('contact_list/selectedCompanies',val)
                }
            },
            selectedProjects: {
                get() { return this.$store.getters['contact_list/selectedProjects'] },
                set(val) { this.$store.commit('contact_list/selectedProjects',val) }
            },
            search: {
                get() { return this.$store.getters['contact_list/search']},
                set(val) {this.$store.commit('contact_list/search',val)}
            },
        },
        methods: {
            refetchContacts() {
                this.$store.dispatch('contact_list/fetchData')
            }
        }

    }
</script>