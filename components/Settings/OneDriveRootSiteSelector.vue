<template>
    <v-layout row wrap>
        <v-flex xs6>
            <v-text-field :value="webUrl" :disabled="true" label="Browse for Z: root location" />
        </v-flex>
        <v-flex xs3>
            <one-drive-file-picker v-model="selectedFile" />
        </v-flex>
    </v-layout>
</template>
<script>
   import OneDriveFilePicker from '~/components/OneDriveFilePicker.vue'

    export default {
        components: {OneDriveFilePicker},
        data: () => ({
            // selectedFile: null
        }),
        props: {

        },
        computed: {
            selectedFile: {
                get() { 
                    let oneDriveRoot = this.$store.getters['setting/value']
                    if(oneDriveRoot && oneDriveRoot.webUrl) {
                        return oneDriveRoot
                    } else {
                        return ''
                    }
                },
                set(val) {
                    let selectedItem = val.pop()
                    this.$store.dispatch('setting/value',selectedItem)
                }
            },
            webUrl() {
                let selectedFile = this.selectedFile;
                if(selectedFile && selectedFile.webUrl) {
                        return selectedFile.webUrl
                } else {
                    return null;
                }
            }
        },
        methods: {},
        watch: {
            selectedFile(selectedFile,oldVal) {

            }
        }
    }
</script>