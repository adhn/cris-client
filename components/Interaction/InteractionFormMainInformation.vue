<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <!-- <v-card-title>
                    <h3>Main Information</h3>
                </v-card-title> -->
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-text-field label="Interaction Title" v-model="title"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                            <interaction-type-field :label="'Interaction Type'" v-model="interaction_type_id"/>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-text-field label="Description" v-model="description"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-text-field label="Location" v-model="location"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                            <company-field :label="'Companies'" :multiple="true" v-model="companies"/>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                            <contact-field :label="'Contacts'" :multiple="true" v-model="contacts"/>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs3>
                            <project-field :label="'Projects'" :multiple="true" v-model="projects"/>
                        </v-flex>
                    </v-layout>
                    
                    <v-layout row wrap>
                        <v-flex xs3>
                            <event-field :label="'Events'" :multiple="true" v-model="events"/>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>

</template>

<script>
    import InteractionTypeField from '~/components/Fields/InteractionTypeField.vue'

    import CompanyField from '~/components/Fields/CompanyField.vue'
    import ContactField from '~/components/Fields/ContactField.vue'
    import ProjectField from '~/components/Fields/ProjectField.vue'
    import EventField from '~/components/Fields/EventField.vue'

    // https://forum.vuejs.org/t/vuejs-sending-v-model-property-from-child-to-parent/22884/2

    export default {
        components: {InteractionTypeField,CompanyField,ContactField,ProjectField,EventField},
        data: () => ({
            checklistItems: []
        }),
        computed: {
            interaction_type_id: {
                get () { return this.$store.getters['interaction/interaction_type_id'] },
                set (value) { this.$store.commit('interaction/interaction_type_id',value) }
            },                                                                            
            title: {
                get () { return this.$store.getters['interaction/title'] },
                set (value) { this.$store.commit('interaction/title',value) }
            },   
            description: {
                get () { return this.$store.getters['interaction/description'] },
                set (value) { this.$store.commit('interaction/description',value) }
            },   
            location: {
                get () { return this.$store.getters['interaction/location'] },
                set (value) { this.$store.commit('interaction/location',value) }
            },
            companies: {
                get () { return this.$store.getters['interaction/companies'] },
                set (value) { this.$store.commit('interaction/companies',value) }
            },     
            contacts: {
                get () { return this.$store.getters['interaction/contacts'] },
                set (value) { this.$store.commit('interaction/contacts',value) }
            },     
            projects: {
                get () { return this.$store.getters['interaction/projects'] },
                set (value) { this.$store.commit('interaction/projects',value) }
            },     
            events: {
                get () { return this.$store.getters['interaction/events'] },
                set (value) { this.$store.commit('interaction/events',value) }
            },     
        },
        methods: {

        },
        watch: {

        }
    }
</script>