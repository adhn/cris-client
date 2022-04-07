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
                        <h3>Relations History</h3>
                    </v-card-title>
                    <v-card-text>
                        <audit-pivot-list />
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import AuditList from '~/components/AuditList/AuditList.vue'
    import AuditPivotList from '~/components/AuditPivotList/AuditPivotList.vue'


    export default {
        props: [],
        components: {
            AuditList,
            AuditPivotList
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
