<template>
<div>
    <v-layout row mb-3>
        <template v-if="id">
            <v-flex xs12 class="mb-3">
                <v-card>
                    <v-card-title>
                        <h2>{{name}}</h2>
                    </v-card-title>
                </v-card>
            </v-flex>
        </template>
    </v-layout>

    <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <h3>Main Information</h3>
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs3>
                                <v-text-field label="Checklist Template name" v-model="name"></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>

        <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <h3>Checklist Template Items</h3>
                    <v-spacer />
                    <v-btn color="primary" @click="addChecklistItem()"><v-icon left>add</v-icon>Add Checklist Item</v-btn>
                </v-card-title>
                <v-card-text>
                        <checklist-template-checklist-item-list :checklistItems="checklistItems" :enabled="true"/>
                </v-card-text>
                <v-card-actions>
                    <!-- <v-btn fab small outline dark color="primary" @click="addChecklistItem">
                        <v-icon>add</v-icon>
                    </v-btn> -->
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>

    <v-layout column class="fab-container">
            <!-- <v-btn class="" color="secondary" fab dark :to="{name: 'projects-id'}">
                <v-icon>close</v-icon>
            </v-btn> -->

                <v-btn color="secondary" fab dark @click.native="close">
                    <v-icon>close</v-icon>
                </v-btn>


            <v-btn class="" color="primary" fab dark @click.native="save()">
                <v-icon>save</v-icon>
            </v-btn>
    </v-layout>
</div>
</template>

<script>

    import {mapGetters} from 'vuex';
    import ChecklistTemplateChecklistItemList from '~/components/ChecklistTemplate/ChecklistTemplateChecklistItemList.vue'

    export default {
        components: {ChecklistTemplateChecklistItemList},
        methods: {
            save() {
                return this.$store.dispatch('checklist_template/save')
            },
            edit() {
                    this.$router.push({ name: 'settings-checklistTemplates-edit-id', params: { id: this.id }})
            },
            close() {
                if(this.id) {
                    this.$router.push({ name: 'settings-checklistTemplates-id', params: { id: this.id }})
                } else {
                    this.$router.push({ name: 'settings-checklistTemplates'})
                }
            },
            addChecklistItem() {
                this.$store.commit('checklist_template/addChecklistItem')
            }
        }, 
        computed: {
            ...mapGetters('checklist_template',['id','checklistItems']),
            name: {
                get () { return this.$store.getters['checklist_template/name'] },
                set (value) { this.$store.commit('checklist_template/name',value) }
            },
        }
    }
</script>
<style>
  .fab-container {
    position: fixed;
    top: 64px;
    right: 0;
  }
</style>