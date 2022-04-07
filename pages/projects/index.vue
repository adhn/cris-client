<template>
    <div>
        <!-- Companies Table controls -->

            <projects-list-filter-controls>
                <v-flex xs1>
                    <v-btn v-shortkey="['insert']" @shortkey.native="$router.push({name: 'projects-new'})" :to="{name: 'projects-new'}" color="primary" dark class="mb-2">New Project</v-btn>
                </v-flex>
            </projects-list-filter-controls>

        <!-- Companies Table -->
        <projects-list class="elevation-10" />

        <v-layout row wrap>
            <ProjectTrashedCountButton v-if="isAdmin" class="ml-0" :to="{ name: 'projects-trashed' }" />
            <v-btn style="display:none" v-shortkey="['esc']" @shortkey.native="resetFilters()"></v-btn>

        </v-layout>
    </div>
</template>
<script>
    import ProjectsList from '~/components/ProjectsList/ProjectsList.vue';
    import ProjectsListFilterControls from '~/components/ProjectsList/ProjectsListFilterControls.vue';
    import ProjectTrashedCountButton from '~/components/ProjectsList/ProjectTrashedCountButton.vue';
    import {mapGetters} from 'vuex';

    export default {
        components: { ProjectsList,ProjectsListFilterControls,ProjectTrashedCountButton},
        fetch ({ store, params }) {
            return Promise.all([
                store.dispatch('project_list/fetchProjects'),
                store.dispatch('company_field/fetchIssuerCompanies')
            ])
        },
        created() {

        },
        computed: {
            ...mapGetters('auth',['isAdmin'])
        },
        methods: {
            resetFilters() {
                    this.$store.commit('project_list/resetFilters')
                    this.$store.dispatch('project_list/fetchProjects')
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if(vm.$route.query.reset) {
                    vm.resetFilters()
                }
            })
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