<template>
    <div>
        <one-drive-root-site-selector v-if="isAdmin"  />


        <!-- Refresh Microsoft Azure Active Directory Users -->
        <v-btn v-if="isAdmin" :loading="usersLoading" @click="refreshUsers()" color="primary">Refresh Microsoft Azure Active Directory Tenant Users</v-btn>



        <!-- Companies Table controls -->
        <checklist-template-list-filter-controls v-if="isAdmin">
            <v-flex xs1>
                <v-btn :to="{name: 'settings-checklistTemplates-new'}" color="primary" dark class="mb-2">New Checklist Template</v-btn>
            </v-flex>
        </checklist-template-list-filter-controls>

        <!-- Companies Table -->
        <checklist-template-list class="elevation-10" />



    </div>
</template>
<script>
    import ChecklistTemplateList from '~/components/ChecklistTemplateList/ChecklistTemplateList.vue';
    import ChecklistTemplateListFilterControls from '~/components/ChecklistTemplateList/ChecklistTemplateListFilterControls.vue';
    import OneDriveRootSiteSelector from '~/components/Settings/OneDriveRootSiteSelector.vue'
    import {mapGetters} from 'vuex';

    export default {
        components: { ChecklistTemplateList,ChecklistTemplateListFilterControls,OneDriveRootSiteSelector},
        fetch ({ store, params }) {
            return Promise.all([
                store.dispatch('checklist_template_list/fetchChecklistTemplates'),
                store.dispatch('setting/edit'),

            ])
        },
        methods: {
            refreshUsers() {
                this.$store.dispatch('setting/refreshUsers')
            }
        },
        computed: {
            ...mapGetters('auth',['isAdmin']),
            ...mapGetters('setting',['usersLoading'])

        },
    }
</script>