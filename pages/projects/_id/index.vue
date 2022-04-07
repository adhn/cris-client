<template>
<div>
        <project-main-information class="mb-3" />
        <template v-if="showBondInformationAndFeeStructure">
            <v-layout row wrap class="mb-3">
                <v-flex xs12>
                <v-card>
                    <v-card-text>
                        <v-layout row wrap>
                        <v-flex xs4>
                            <project-bond-information  />
                        </v-flex>
                        <v-flex xs4>
                            <project-transaction-structure  />
                        </v-flex>
                        <v-flex xs4>
                            <project-fee-structure />
                        </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                </v-flex>
            </v-layout>
        </template>

        <project-whiteboard class="mb-3" />
        <project-companies class="mb-3" />
        <project-contacts class="mb-3" />
        <project-events class="mb-3" />
        <project-interactions class="mb-3" />
        <project-notes class="mb-3" />
        <project-checklist class="mb-3" />
        <project-email-communication class="mb-3" />
        <project-history class="mb-3" />
</div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import ProjectMainInformation from '~/components/Project/ProjectMainInformation.vue'

    import ProjectBondInformation from '~/components/Project/ProjectBondInformation.vue'
    import ProjectTransactionStructure from '~/components/Project/ProjectTransactionStructure.vue'
    import ProjectFeeStructure from '~/components/Project/ProjectFeeStructure.vue'


    import ProjectWhiteboard from '~/components/Project/ProjectWhiteboard.vue'

    import ProjectCompanies from '~/components/Project/ProjectCompanies.vue'
    import ProjectContacts from '~/components/Project/ProjectContacts.vue'
    import ProjectEvents from '~/components/Project/ProjectEvents.vue'
    import ProjectInteractions from '~/components/Project/ProjectInteractions.vue'
    import ProjectNotes from '~/components/Project/ProjectNotes.vue'
    import ProjectChecklist from '~/components/Project/ProjectChecklist.vue'
    import ProjectEmailCommunication from '~/components/Project/ProjectEmailCommunication.vue'
    import ProjectHistory from '~/components/Project/ProjectHistory.vue'



    export default {
        components: {
            ProjectMainInformation,
            ProjectBondInformation,
            ProjectTransactionStructure,
            ProjectFeeStructure,
            ProjectWhiteboard,
            ProjectCompanies,
            ProjectContacts,
            ProjectEvents,
            ProjectInteractions,
            ProjectNotes,
            ProjectChecklist,
            ProjectEmailCommunication,
            ProjectHistory
        },
        data: () => ({
            projectId: null
        }),
        computed: {
            ...mapGetters('project',['project','showBondInformationAndFeeStructure']),            
        },
        async fetch({ store, params }) {
            // store.commit('contact/reset')
            this.projectId = parseInt(params.id)
            return Promise.all([
                store.dispatch('project/edit',parseInt(params.id)),
                store.dispatch('project_role_field/fetchProjectRoles'),
                store.dispatch('currency_field/fetchCurrencies'),
                
                store.commit('contact_list/resetFilters'),     
                store.commit('contact_list/selectedProjects',[parseInt(params.id)]),
                store.dispatch('contact_list/fetchData'),
                
                store.commit('company_list/resetFilters'),     
                store.commit('company_list/selectedProjects',[parseInt(params.id)]),
                store.dispatch('company_list/fetchCompanies'),
                
                store.commit('event_list/resetFilters'),     
                store.commit('event_list/associatedWithProjects',[parseInt(params.id)]),
                store.dispatch('event_list/fetchEvents'),

                store.commit('checklist_list/resetFilters'),     
                store.commit('checklist_list/belongingToProject',parseInt(params.id)),
                store.dispatch('checklist_list/fetchChecklists'),


                store.commit('interaction_list/resetFilters'),     
                store.commit('interaction_list/associatedWithProjects',[parseInt(params.id)]),
                store.dispatch('interaction_list/fetchInteractions'),

                store.commit('note_list/resetFilters'),     
                store.commit('note_list/belongingToProject',parseInt(params.id)),
                store.dispatch('note_list/fetchNotes'),

                store.commit('audit_list/resetFilters'),     
                store.commit('audit_list/auditableType',"App\\Project"),
                store.commit('audit_list/auditableId',parseInt(params.id)),
                store.dispatch('audit_list/fetchAudits'),

                store.commit('audit_pivot_list/resetFilters'),     
                store.commit('audit_pivot_list/relationType',"App\\Project"),
                store.commit('audit_pivot_list/relationId',parseInt(params.id)),
                store.dispatch('audit_pivot_list/fetchAuditPivots'),

                store.dispatch('settlement_option_field/fetchSettlementOptions'),
                store.dispatch('checklist_template_field/fetchChecklistTemplates'),


            ])

        }
    }
</script>