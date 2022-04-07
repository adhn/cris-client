<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-btn slot="activator" flat color="primary"><v-icon>add</v-icon></v-btn>
        <v-card>

        <v-toolbar>

          <v-toolbar-title>Add new event to Project</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat color="" @click="dialog = false">
                Close
                <v-icon right>close</v-icon>
            </v-btn>
            <v-btn class ="ml-3" flat large color="primary" @click="save()">Save<v-icon right>save</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
            <v-card-text>
                <event-form-main-information />
            </v-card-text>
        </v-card>
    </v-dialog>    
</template>
<script>

    // import EventForm from '~/components/Event/EventForm.vue'
    import EventFormMainInformation from '~/components/Event/EventFormMainInformation.vue'

    export default {
        props: ['projectId'],
        components: {
            EventFormMainInformation
        },
        data: () => ({
            dialog: false,
        }),
        methods: {
            save() {
                this.$store.dispatch('event/save').then(this.dialog = false)
            },
        },
        computed: {
            project_id: {
                get () { return this.$store.getters['event/project_id'] },
                set (value) { this.$store.commit('event/project_id',value) }
            },
            name: {
                get () { return this.$store.getters['event/name'] },
                set (value) { this.$store.commit('event/name',value) }
            },
        },
        watch: {
            dialog(value,oldValue) {
                if(value == true) {
                    // dialog has been opened
                    this.$store.commit('event/reset'),
                    this.$store.commit('event/new'),
                    this.$store.dispatch('event_type_field/fetchEventTypes'),
                    this.$store.dispatch('project_field/fetchProjects'),
                    this.$store.dispatch('checklist_template_field/fetchChecklistTemplates'),
                    this.project_id = this.$store.getters['project/id']
                }
                this.$store.commit('visibility/visible',!value)
            },

        },
        mounted: function() {

        }
    }
</script>