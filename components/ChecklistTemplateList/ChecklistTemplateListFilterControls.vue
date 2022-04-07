<template>
    <v-layout row wrap>
        <slot></slot>
        <v-spacer></v-spacer>
        <v-flex pl-3 xs2>
            <v-text-field
                    append-icon="search"
                    label="Search"
                    v-model="search"
            ></v-text-field>
        </v-flex>
    </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        components: {},
        data: () => ({

        }),
        computed: {
            search: {
                get() { return this.$store.getters['checklist_template_list/search']},
                set(val) {
                    this.$store.commit('checklist_template_list/search',val)
                    this.refetchProjects();
                }
            }
        },
        methods: {
            refetchProjects() {
                this.$store.dispatch('checklist_template_list/fetchChecklistTemplates')
            }
        }
    }
</script>