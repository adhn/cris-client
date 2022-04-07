<template>
    <v-layout row wrap style="background-color:white;" mr-2>
        <slot></slot>
        <v-spacer></v-spacer>
        <v-flex xs2>
            <v-select
                    ref="showSelect"
                    :items="showOptions"
                    v-model="selectedShowOption"
                    label="Show"
                    single-line                    
                    persistent-hint
                    item-value="id"
                    item-text="label"
                    v-on:change="refetchMessages()"
            ></v-select>
        </v-flex>

        <!-- <v-flex pl-3 xs2>
            <v-select
                    ref="folderSelect"
                    :items="folderOptions"
                    v-model="selectedFolderOption"
                    persistent-hint
                    label="Folder"
                    single-line
                    item-value="id"
                    item-text="label"
            ></v-select>
        </v-flex> -->
        <!-- <v-flex pl-3 xs2>
            <v-text-field
                    append-icon="search"
                    label="Search"
                    v-model="search"
            ></v-text-field>
        </v-flex> -->
    </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        props: ['storeName'],
        data: () => ({
            showOptions: [
                {
                    'id':'untagged',
                    'label': 'Show Untagged'
                },
                {
                    'id':'tagged',
                    'label': 'Show Tagged'
                },
                {
                    'id': 'both',
                    'label': 'Show Both'
                }
            ],
            // folderOptions: [
            //     {
            //         'id': 'inbox',
            //         'label': 'Inbox'
            //     },
            //     {
            //         'id': 'sentitems',
            //         'label': 'Sent Items',
            //     },
            //     {
            //         'id': 'both',
            //         'label': 'Both'
            //     }
            // ],
            selectedShowOption: 'untagged',
            // selectedFolderOption: null
        }),
        computed: {
            isUncategorized: {
                get() { return this.$store.getters[this.storeName+'/isUncategorized']},
                set(val) {this.$store.commit(this.storeName+'/isUncategorized',val)}
            },
            isCategorized: {
                get() { return this.$store.getters[this.storeName+'/isCategorized']},
                set(val) {this.$store.commit(this.storeName+'/isCategorized',val)}
            },
        },
        methods: {
            refetchMessages() {
                this.$store.dispatch(this.storeName+'/fetchMessages')
            }   
        },
        watch: {
            selectedShowOption(val,oldVal) {
                switch(val) {
                    case "untagged":
                        console.info('we are here untagged');
                        this.isUncategorized = true
                        this.isCategorized = false
                        break;
                    case "tagged":
                        console.info('we are here tagged');
                        this.isUncategorized = false
                        this.isCategorized = true
                        break;  
                    case "both":
                        console.info('we are here both');
                        this.isUncategorized = false
                        this.isCategorized = false
                    break;
                }
            }
        } 

    }
</script>