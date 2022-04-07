<template v-if="event && event.checklist">
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>Checklist</h3>
                        <v-spacer />
                        <v-btn color="primary" @click="addChecklistItem()"><v-icon left>add</v-icon>Add Checklist Item</v-btn>
        
                    </v-card-title>
                    <v-card-text>
                        <checklist :enabled="true"/>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Checklist from '~/components/Checklist/Checklist.vue'
    export default {
        props: [],
        components: {
            Checklist
        },
        data: () => ({

        }),
        methods: {
            addChecklistItem() {
                this.$store.dispatch('checklist/addChecklistItem')
            },
        },
        computed: {
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
