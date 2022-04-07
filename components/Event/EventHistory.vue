<template>    
        <v-layout justify-space-between row fill-height>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>History</h3>
                    </v-card-title>
                    <v-card-text>
                        <audit-list />
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>
                        <h3>Checklist history</h3>
                    </v-card-title>
                    <v-card-text>
                        <audit-checklist-item-list />
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import AuditList from '~/components/AuditList/AuditList.vue'
    import AuditChecklistItemList from '~/components/AuditList/AuditChecklistItemList.vue'

    export default {
        props: [],
        components: {
            AuditList,
            AuditChecklistItemList
        },
        data: () => ({

        }),
        methods: {

        },
        computed: {

        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
