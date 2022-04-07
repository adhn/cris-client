<template>
    <div>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="checklistItems"
                v-bind:rows-per-page-items='[100]'
                :must-sort="mustSort"
        >
            <template slot="items" slot-scope="props">
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
                            <v-icon>remove</v-icon>
                        </v-btn>
                    </template>
                </td>
            </template>
            <template slot="no-data">

            </template>
        </v-data-table>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import DateField from '~/components/Fields/DateField.vue'
    
    export default {
        components: {DateField},
        props: ['checklistItems','enabled'],
        data: () => ({
            mustSort:false,
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
            ]
        }),
        computed: {

        },

        watch: {            


        },

        methods: {
            updateList(item,field,value) {
                this.$store.commit('checklist_template/updateChecklistItem',{
                    item: item,
                    field: field,
                    value: value
                })
            },
            removeItemFromList(item) {
                this.$store.commit('checklist_template/removeItemFromList',item)
            }
        }
    }
</script>