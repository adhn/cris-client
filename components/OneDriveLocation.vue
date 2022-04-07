<template>
    <v-layout row wrap>
        <template v-if="disabled && label">
            <!-- <v-flex xs6 class="mt-2">
            {{label}}
            </v-flex> -->
            <v-spacer />
        </template>

        <template v-if="location">
            <template v-if="loading">
                Loading...
            </template> 
            <template v-else>
                <v-flex xs4>
                    <v-btn flat @click="copyLocalPath()">{{decodeHtml(localPath)}}</v-btn>
                </v-flex>
                <!-- <v-flex xs1>
                    <v-btn flat :href="'file:///'+localPath" target="_blank"><v-icon>link</v-icon></v-btn>
                </v-flex> -->
                <v-flex xs1>
                    <v-btn flat :href="webUrl" target="_blank"><v-icon>open_in_new</v-icon></v-btn>
                </v-flex>
            </template>

        </template>
        <template v-else>
            <template v-if="!disabled">
                <v-flex xs4>
                    <v-text-field :disabled="true" :label="label" />
                </v-flex>
            </template>
        </template>
        <template v-if="!disabled">
            <v-flex xs3 ml-3>
                <one-drive-file-picker v-model="location" :endpointHint="endpointHint" :disableNavigation="disableNavigation" />
            </v-flex>
        </template>
    </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex';
    import OneDriveFilePicker from '~/components/OneDriveFilePicker.vue'

    export default {
        props:['value','label','disabled'],
        components: {OneDriveFilePicker},
        computed: {
            ...mapGetters('auth',['user']),
            disableNavigation() {
                if(!this.endpointHint) {
                    return false
                } else {
                    return true
                }
            }
        },
        data: () => ({
            location: null,
            endpointHint: null,
            folderId: null,
            driveId: null,
            localPath: 'N/A',
            webUrl: 'N/A',
            loading: false
        }),
        methods: {
            getFolderPath(driveId,folderId) {
                this.loading = true
                const authenticatedUserEndpoint = '/onedrive-folder-path/'+driveId+'/'+folderId
                this.$axios.get(authenticatedUserEndpoint)
                .then(response => {
                    this.localPath = response.data.localPath
                    this.webUrl = response.data.webUrl
                    this.loading = false
                });
            },

            copyLocalPath() {
                this.$copyText(this.localPath).then(e => {
                    this.$store.commit('feedback_snackbar/showSnackbar',{
                        text: 'Location copied to clipboard'
                    },{ root: true })
                },e => {
                    this.$store.commit('feedback_snackbar/showSnackbar',{
                        text: 'Location could not be copied to clipboard: '+e,
                        color: 'error',
                    },{ root: true })
                })
            },

            decodeHtml(html) {
                return decodeURI(html)
                // var txt = document.createElement("textarea");
                // txt.innerHTML = html;
                // return txt.value;
            }
        },
        watch: {
            location(val,oldVal) {
                console.info('OneDriveLocation',val)
                if(val) {
                    if(!val.driveId) {
                        this.folderId = val[0].id
                        if(val[0].parentReference && val[0].parentReference.driveId) {
                            this.driveId = val[0].parentReference.driveId
                        }
                    } else {
                        this.folderId = val.folderId
                        this.driveId = val.driveId
                    }
                    console.info('OneDriveLocation folderId driveId',this.folderId,this.driveId)

                    if(this.driveId && this.folderId) {
                        this.getFolderPath(this.driveId,this.folderId) // async
                        this.$emit('input',{folderId: this.folderId,driveId: this.driveId})

                    }

                }
            },
            value(value,oldVal) {
                console.info('OneDriveLocation mounted value',this.value)

                if(this.value) {
                    this.location = this.value
                }
            }
        },
        mounted() {
            this.location = this.value
            this.$store.dispatch('setting/edit').then((resp) => {
                let value = this.$store.getters['setting/value']
                if(value && value.webUrl) {
                    this.endpointHint = value.webUrl
                } 
            })
        }
    }
</script>
