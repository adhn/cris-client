<template>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="checklistItems"
                v-bind:rows-per-page-items='[100]'
                :pagination.sync="pagination"
                :loading="loading"
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>
                        <v-text-field :readonly="!enabled" :value="props.item.name" @keyup="updateList(props.item,'name',$event.target.value)" :label="'Name'" />
                    </td>
                    <td>
                            <v-radio-group :readonly="!enabled" :value="props.item.status" @change="updateList(props.item,'status',$event)">
                                <template v-for="statusObj in statuses">
                                    <v-radio :key="statusObj.value" :label="statusObj.text" :value="statusObj.value"></v-radio>
                                </template>
                            </v-radio-group>
                    </td>
                    <td>
                            <date-field :enabled="enabled" :label="'Due date'" :value="props.item.due_date" @input="updateList(props.item,'due_date',$event)" />
                            
                            
                            <v-checkbox :readonly="!enabled" :label="'Estimated'" :input-value="props.item.due_date_tentative" @change="updateList(props.item,'due_date_tentative',$event)" />
                    </td>

                    <td>
                        <v-textarea :readonly="!enabled" :label="'Note'" :value="props.item.note" @keyup="updateList(props.item,'note',$event.target.value)" />
                    </td>
                    <td>
                            <template v-if="enabled">
                                <v-btn small dark color="primary" icon @click="removeItemFromList(props.item)">
                                    
                                    <template v-if="props.item.loading">
                                        <!-- <v-progress-circular
                                        indeterminate
                                        color="primary"
                                        :width="1"
                                        :size="24"
                                        ></v-progress-circular> -->
                                        <v-icon>hourglass_empty</v-icon>

                                    </template>
                                    <template v-else>
                                        <v-icon>remove</v-icon>
                                    </template>
                                </v-btn>
                            </template>
                    </td>
                </tr>
            </template>
            <template slot="no-data">

            </template>
        </v-data-table>
</template>

<script>
    import {mapGetters} from 'vuex';
    import DateField from '~/components/Fields/DateField.vue'
    
    export default {
        components: {DateField},
        props: ['enabled'],
        data: () => ({
            headers: [
                {
                    text: 'Item Name',
                    align: 'left',
                    sortable: false,
                    value: 'name',
                    width: '20%'
                },
                {
                    text: 'Status',
                    align: 'left',
                    sortable: false,
                    value: 'status',
                    width: '20%'
                },
                {
                    text: 'Date',
                    align: 'left',
                    value: 'due_date',
                    sortable: false,
                    width: '20%'
                },
                {
                    text: 'Note',
                    align: 'left',
                    value: 'note',
                    sortable: false,
                    width: '40%'
                }
            ],
            statuses: [
                {value:'DONE',text:'Done'},
                {value:'NOT DONE',text:'Not Done'},
                {value:'N/A',text:'Not Applicable'}
            ],
            pagination: {
                page: 1,
                rowsPerPage: 1000,
                sortBy: '',
                descending: false
            },
        }),
        computed: {
            ...mapGetters('checklist',['checklist','checklistItems','loading','id']),
            
        },

        watch: {            


        },

        methods: {
            updateList(item,field,value) {
                if(field == 'due_date' || field == 'due_date_tentative' || field == 'status') {
                    if(item.id) {
                        this.$store.dispatch('checklist/updateChecklistItem',{
                            item: item,
                            field: field,
                            value: value
                        })
                    } else {
                        this.$store.commit('checklist/updateChecklistItem',{
                            item: item,
                            field: field,
                            value: value
                        })
                    }
                } else {
                    if(item.id) {
                        this.$store.dispatch('checklist/delayedUpdateChecklistItem',{
                            item: item,
                            field: field,
                            value: value
                        })
                    } else {
                        this.$store.commit('checklist/updateChecklistItem',{
                            item: item,
                            field: field,
                            value: value
                        })                    
                    }
                }
            },
            removeItemFromList(item) {
                console.info('removeItemFromlist id',this.id)
                if(this.id) {
                    console.info('removeItemFromlist dispatching')
                    this.$store.dispatch('checklist/removeItemFromList',item)
                } else {
                    console.info('removeItemFromlist committing')
                    this.$store.commit('checklist/removeItemFromList',item)
                }
            }
        }
    }
</script>