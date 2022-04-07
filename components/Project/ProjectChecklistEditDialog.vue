<template>
    <v-dialog v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
    >
        <v-btn flat slot="activator">{{checklistName}}</v-btn>
            <v-card tile>
                <v-toolbar card dark color="primary">
                        <h1>Editing {{projectName}} checklist - {{name}}</h1>


                    <v-spacer />
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>

                    <template v-if="loading">
                        <v-card-text>
                            <v-progress-linear color="primary" v-if="loading" indeterminate />
                        </v-card-text>
                    </template>
                    <template v-else>
                        <checklist-form-auto-saving :loading="loading" />
                    </template>
            </v-card>
    </v-dialog>    
</template>
<script>
    import ChecklistFormAutoSaving from '~/components/Checklist/ChecklistFormAutoSaving.vue'
    import {mapGetters} from 'vuex';

    export default {
        props: ['checklistId','checklistName'],
        components: {
            ChecklistFormAutoSaving
        },
        data: () => ({
            dialog: false,
            loading: false
        }),
        methods: {

        },
        computed: {
            ...mapGetters('checklist',['id','name']),
            projectName: {
                get () { return this.$store.getters['project/name'] },
            },
        },
        watch: {
            dialog(value,oldValue) {
                if(value == true) {
                    // dialog has been opened
                    this.loading = true
                    this.$store.commit('checklist/reset'),
                    this.$store.dispatch('checklist/edit',parseInt(this.checklistId)).then((resp) => {
                        this.loading = false
                    })

                }
                this.$store.commit('visibility/visible',!value)
            },
        },
        mounted: function() {

        }
    }
</script>