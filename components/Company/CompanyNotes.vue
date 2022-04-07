<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Notes</h3>
                        <v-spacer />
                        <v-btn flat :to="{ name: 'notes'}"><v-icon>open_in_new</v-icon></v-btn>
                    </v-card-title>
                    <v-card-text>
                        <note-list />
                        <v-layout row wrap align-end justify-end>
                            <v-flex xs10>
                                <v-textarea
                                outline
                                name="Note"
                                label=""
                                v-model="note"
                                ></v-textarea>

                            </v-flex>
                            <v-flex xs2 justify-space-between="">
                                <v-spacer />
                                <v-btn color="primary" @click="createNewNote().then(refreshNotes)">
                                     <v-icon left>save</v-icon>
                                    Add Note     
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import NoteList from '~/components/NoteList/NoteList.vue';
    // import NoteListFilterControls from '~/components/NoteList/NoteListFilterControls.vue';

    export default {
        props: ['projectId'],
        components: {
            NoteList
        },
        data: () => ({
            note: '',
        }),
        methods: {
            createNewNote() {
                this.$store.commit('note/newNote')
                this.$store.commit('note/company_id',this.$store.getters['company/id'])
                this.$store.commit('note/note',this.note)
                return this.$store.dispatch('note/save')

            },
            refreshNotes() {
                this.$store.dispatch('note_list/fetchNotes')
                this.note = ''
            }
        },
        computed: {


        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
