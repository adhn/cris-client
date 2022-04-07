<template>
    <div>
        <!-- Notes Table controls -->

            <note-list-filter-controls>
                <v-flex xs1>
                    <v-btn v-shortkey="['insert']" @shortkey.native="$router.push({name: 'notes-new'})" :to="{name: 'notes-new'}" color="primary" dark class="mb-2">New Note</v-btn>
                </v-flex>
            </note-list-filter-controls>

        <!-- Notes Table -->
        <note-list class="elevation-10" />

        <v-btn style="display:none" v-shortkey="['esc']" @shortkey.native="resetFilters()"></v-btn>


    </div>
</template>
<script>
    import NoteList from '~/components/NoteList/NoteList.vue';
    import NoteListFilterControls from '~/components/NoteList/NoteListFilterControls.vue';

    export default {
        components: { NoteList,NoteListFilterControls},
        fetch ({ store, params }) {
            return Promise.all([
                store.dispatch('note_list/fetchNotes'),
                store.dispatch('project_field/fetchProjects'),
                store.dispatch('company_field/fetchCompanies'),
                store.dispatch('user_field/fetchUsers'),
                store.dispatch('event_field/fetchEvents'),


                // store.dispatch('event_field/fetchEvents'),



            ])
        },
        created() {

        },
        methods: {
            resetFilters() {
                this.$store.commit('note_list/resetFilters')
                this.$store.dispatch('note_list/fetchNotes')
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