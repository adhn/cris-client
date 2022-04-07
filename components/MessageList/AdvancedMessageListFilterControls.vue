<template>
    <v-toolbar app color="white" prominent>
        <v-spacer />
        <!-- <v-flex xs3>
            <date-field v-model="dateFrom" :label="'Date From'"/>
        </v-flex>
        <v-flex xs3>
            <date-field v-model="dateTo" :label="'Date To'"/>

        </v-flex> -->
        <v-flex pl-3 xs3>
            <date-range-field v-model="dateRange" :label="'Date range'" />
        </v-flex>
        <v-flex pl-3 xs3>
            <v-autocomplete
                v-model="fromContact"
                :loading="filtersLoading"
                :items="contacts"
                label="From"
                item-text="display_name"
                item-value="id"
                @change="refetchMessages()"
                v-bind:clearable="true">
            </v-autocomplete>
        </v-flex>

        <v-flex pl-3 xs3>
            <v-autocomplete
                v-model="toContacts"
                :loading="filtersLoading"
                :items="contacts"
                label="To/CC"
                item-text="display_name"
                item-value="id"
                @change="refetchMessages()"
                multiple
                v-bind:clearable="true"
            >
            </v-autocomplete>
        </v-flex>
        <v-flex pl-3 xs3>
            <v-autocomplete
                    ref="companySelect"
                    :items="companies"
                    v-model="selectedCompanies"
                    multiple
                    label="Company"
                    single-line
                    item-value="id"
                    item-text="name"
                    v-bind:loading="filtersLoading"
                    v-bind:clearable="true"
                    v-on:change="refetchMessages()"
            ></v-autocomplete>
        </v-flex>

        <v-flex pl-3 xs3>
            <v-autocomplete
                    ref="projectSelect"
                    :items="projects"
                    v-model="selectedProjects"
                    multiple
                    label="Project"
                    single-line
                    item-value="id"
                    item-text="name"
                    v-bind:loading="filtersLoading"
                    v-bind:clearable="true"
                    v-on:change="refetchMessages()"
            ></v-autocomplete>
        </v-flex>

        <v-flex pl-3 xs3>
            <v-text-field
                    append-icon="search"
                    label="Search"
                    v-model="search"
                    :clearable="true"
                    v-shortkey="['ctrl','f']"
                    ref="search"
                    @shortkey.native="$refs.search.focus()"
            ></v-text-field>
        </v-flex>
    </v-toolbar>
</template>
<script>
    import {mapGetters} from 'vuex';
    // import DateField from '~/components/Fields/DateField.vue'
    import DateRangeField from '~/components/Fields/DateRangeField.vue'

    export default {
        props: ['storeName'],
        components: {DateRangeField},
        data: () => ({
            dateRange: [this.dateFrom,this.dateTo]
        }),
        computed: {
            ...mapGetters('message_list',['companies','filtersLoading','projects','contacts']),
            selectedCompanies: {
                get() { return this.$store.getters[this.storeName+'/selectedCompanies']},
                set(val) { this.$store.commit(this.storeName+'/selectedCompanies',val)}
            },
            selectedProjects: {
                get() { return this.$store.getters[this.storeName+'/selectedProjects'] },
                set(val) { this.$store.commit(this.storeName+'/selectedProjects',val) }
            },
            dateFrom: {
                get() { return this.$store.getters[this.storeName+'/dateFrom'] },
                set(val) { this.$store.commit(this.storeName+'/dateFrom',val) }
            },
            dateTo: {
                get() { return this.$store.getters[this.storeName+'/dateTo'] },
                set(val) { this.$store.commit(this.storeName+'/dateTo',val) }
            },
            fromContact: {
                get() { return this.$store.getters[this.storeName+'/fromContact'] },
                set(val) { this.$store.commit(this.storeName+'/fromContact',val) }
            },
            toContacts: {
                get() { return this.$store.getters[this.storeName+'/toContacts'] },
                set(val) { this.$store.commit(this.storeName+'/toContacts',val) }
            },
            search: {
                get() { return this.$store.getters[this.storeName+'/search']},
                set(val) {this.$store.commit(this.storeName+'/search',val)}
            },
            showUncategorized: {
                get() { return this.$store.getters[this.storeName+'/showUncategorized']},
                set(val) {this.$store.commit(this.storeName+'/showUncategorized',val)}
            },
        },
        methods: {
            refetchMessages() {
                this.$store.dispatch(this.storeName+'/fetchMessages')
            },

        },
        watch: {
            dateRange(val) {
                this.dateFrom = val[0]
                this.dateTo = val[1]
                this.refetchMessages()
            },
            search(val,oldVal) {
                if(val) {
                    if(oldVal) {
                        if(val.length < oldVal.length) {
                            this.refetchMessages()
                        }
                    }
                    if(val.length > 2) {
                        this.refetchMessages()
                    }
                } else {
                    this.refetchMessages()
                }
            }
        } 

    }

</script>