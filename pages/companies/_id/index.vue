<template>
    <div>
        <company-main-information class="mb-3" v-observe-visibility="companyMainInformationVisibilityChanged"/>
        <company-whiteboard class="mb-3" v-observe-visibility="companyWhiteboardVisibilityChanged" />
        
        <company-projects class="mb-3" v-observe-visibility="companyProjectsVisibilityChanged" />
        
        <company-contacts class="mb-3" v-observe-visibility="companyContactsVisibilityChanged" />
        
        <company-interactions class="mb-3" v-observe-visibility="companyInteractionsVisibilityChanged" />
        
        <company-notes class="mb-3" v-observe-visibility="companyNotesVisibilityChanged" />
        
        <company-history class="mb-3" v-observe-visibility="companyHistoryVisibilityChanged" />
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import CompanyMainInformation from '~/components/Company/CompanyMainInformation.vue'
    import CompanyWhiteboard from '~/components/Company/CompanyWhiteboard.vue'
    import CompanyProjects from '~/components/Company/CompanyProjects.vue'
    import CompanyContacts from '~/components/Company/CompanyContacts.vue' 
    import CompanyInteractions from '~/components/Company/CompanyInteractions.vue'
    import CompanyNotes from '~/components/Company/CompanyNotes.vue'
    import CompanyHistory from '~/components/Company/CompanyHistory.vue'


    export default {
        components: {
            CompanyMainInformation,
            CompanyWhiteboard,
            
            CompanyProjects,
            CompanyContacts,
            CompanyInteractions,

            CompanyNotes,
            CompanyHistory
        },
        data: () => ({
        }),
        computed: {
            ...mapGetters('company',['company']),            
        },
        async fetch({ store, params }) {
            // store.commit('contact/reset')
            return Promise.all([
                
                store.dispatch('company/edit',parseInt(params.id)),
                store.dispatch('project_role_field/fetchProjectRoles'),
                

                store.commit('project_list/resetFilters'),
                store.commit('project_list/associatedWithCompanies',[parseInt(params.id)]),
                store.dispatch('project_list/fetchProjects'),

                store.commit('note_list/resetFilters'),
                store.commit('note_list/belongingToCompany',parseInt(params.id)),
                store.dispatch('note_list/fetchNotes',{refresh:false}),

                
                store.commit('contact_list/resetFilters'),
                store.commit('contact_list/selectedCompanies',[parseInt(params.id)]),
                store.dispatch('contact_list/fetchData'),
                
                store.commit('interaction_list/resetFilters'),
                store.commit('interaction_list/associatedWithCompanies',[parseInt(params.id)]),
                store.dispatch('interaction_list/fetchInteractions'),
                
                store.commit('audit_list/auditableType',"App\\Company"),
                store.commit('audit_list/auditableId',parseInt(params.id)),
                store.dispatch('audit_list/fetchAudits'),

                store.commit('audit_pivot_list/resetFilters'),     
                store.commit('audit_pivot_list/auditableType',"App\\Company"),
                store.commit('audit_pivot_list/auditableId',parseInt(params.id)),
                store.dispatch('audit_pivot_list/fetchAuditPivots'),

            ])

        },
        methods: {
            companyMainInformationVisibilityChanged(isVisible,entry) {
                console.info('companyMainInformationVisibilityChanged',isVisible)
            },
            companyWhiteboardVisibilityChanged(isVisible,entry) {
                console.info('companyWhiteboardVisibilityChanged',isVisible)
            },
            companyProjectsVisibilityChanged(isVisible,entry) {
                console.info('companyProjectsVisibilityChanged',isVisible)
            },
            companyContactsVisibilityChanged(isVisible,entry) {
                console.info('companyContactsVisibilityChanged',isVisible)
            },
            companyInteractionsVisibilityChanged(isVisible,entry) {
                console.info('companyInteractionsVisibilityChanged',isVisible)
            },
            companyNotesVisibilityChanged(isVisible,entry) {
                console.info('companyNotesVisibilityChanged',isVisible)
            },
            companyHistoryVisibilityChanged(isVisible,entry) {
                console.info('companyHistoryVisibilityChanged',isVisible)
            },
        }
    }
</script>