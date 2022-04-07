<template>
    <div>
        <!-- Companies Table controls -->
            <company-list-filter-controls>
                <v-flex xs1>
                    <v-btn v-shortkey="['insert']" @shortkey.native="$router.push({name: 'companies-new'})" :to="{name: 'companies-new'}" color="primary" dark class="mb-2">New Company</v-btn>
                </v-flex>
            </company-list-filter-controls>
        <!-- Companies Table -->
        <company-list class="elevation-10" />

        <v-layout row wrap>
            <CompanyTrashedCountButton v-if="isAdmin" class="ml-0" :to="{ name: 'companies-trashed' }" />
            <v-btn style="display:none" v-shortkey="['esc']" @shortkey.native="resetFilters()"></v-btn>
        </v-layout>
    </div>
</template>
<script>
    import CompanyList from '~/components/CompanyList/CompanyList.vue';
    import CompanyListFilterControls from '~/components/CompanyList/CompanyListFilterControls.vue';
    import CompanyTrashedCountButton from '~/components/CompanyList/CompanyTrashedCountButton.vue';
    import {mapGetters} from 'vuex';

    export default {
        components: { CompanyList,CompanyListFilterControls,CompanyTrashedCountButton},
        data: () => ({

        }),
        fetch ({ store, params }) {
            return Promise.all([        
                store.dispatch('company_list/fetchCompanies'),
                store.dispatch('project_role_field/fetchProjectRoles'),
                store.dispatch('project_field/fetchProjects')

            ])
        },
        computed: {
            ...mapGetters('auth',['isAdmin'])
        },
        created() {

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if(vm.$route.query.reset) {
                    vm.resetFilters()
                }
            })
        }, 
        methods: {
            keyUp(event) {
                console.info('keyup event',event)
            },

            visibilityChange(evt, hidden) {
            // do something
                console.log('companies/index visibility hidden',hidden);
            },
            resetFilters() {
                    this.$store.commit('company_list/resetFilters')
                    this.$store.dispatch('company_list/fetchCompanies')
            }
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