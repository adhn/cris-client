<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-btn slot="activator" flat color="primary"><v-icon>add</v-icon></v-btn>
        <v-card>

        <v-toolbar>

          <v-toolbar-title>Add new interaction to Project</v-toolbar-title>
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
                <interaction-form-main-information class="mb-3" />
            </v-card-text>
        </v-card>
    </v-dialog>    
</template>
<script>

    import InteractionFormMainInformation from '~/components/Interaction/InteractionFormMainInformation.vue'

    export default {
        props: ['projectId'],
        components: {
            InteractionFormMainInformation
        },
        data: () => ({
            dialog: false,
        }),
        methods: {
            save() {
                this.$store.dispatch('interaction/save').then(this.dialog = false)
            },

        },
        computed: {
            projects: {
                get () { return this.$store.getters['interaction/projects'] },
                set (value) { this.$store.commit('interaction/projects',value) }
            },
            title: {
                get () { return this.$store.getters['interaction/title'] },
                set (value) { this.$store.commit('interaction/title',value) }
            },
        },
        watch: {
            dialog(value,oldValue) {
                if(value == true) {
                    // dialog has been opened
                    this.$store.dispatch('interaction_type_field/fetchInteractionTypes'),
                    this.$store.dispatch('company_field/fetchCompanies'),
                    this.$store.dispatch('contact_field/fetchContacts'),
                    this.$store.dispatch('project_field/fetchProjects'),
                    this.$store.dispatch('event_field/fetchEvents'),


                    this.$store.commit('interaction/new')
                    this.projects = [this.$store.getters['project/id']]
                }
                this.$store.commit('visibility/visible',!value)
            },

        },
        mounted: function() {

        }
    }
</script>