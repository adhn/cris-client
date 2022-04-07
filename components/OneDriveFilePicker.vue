<template>
    <v-btn @click="selectFolder()">Browse OneDrive</v-btn>
</template>
<script>
import {mapGetters} from 'vuex';

export default {
    props: {
            // value: {
            //     type: String,
            //     default: null
            // },
            disableNavigation: {
                type: Boolean,
                default: false
            },
            endpointHint: {
                type: String,
                default: null
            }
    },
    methods: {
        selectFolder() {
            // http://hawramani.com/how-to-get-a-demo-of-the-onedrive-file-picker-javascript-sdk-to-work-on-a-local-development-server/
            let odOptions = {
                clientId: '45e55991-1969-45f3-9f5b-60025dc00577',
                action: "query", // to return identifiers that can be used with the Microsoft Graph API or OneDrive API.
                multiSelect: false,
                openInNewWindow: false,
                viewType: "folders",
                advanced: {
                    // https://docs.microsoft.com/en-us/onedrive/developer/controls/file-pickers/js-v72/open-file?view=odsp-graph-online#advanced-options
                    filter: "folder",
                    // redirectUri: 'http://local.cris.7corner.eu/msodrive_filepicker.html',
                    redirectUri: window.location.protocol+'//'+window.location.host+'/msodrive_filepicker.html',
                    accessToken: this.user.graph_access_token,
                    queryParameters: this.queryParameters, 
                    navigation: {
                        // entryLocation: {
                        //     sharePoint: {
                        //         sitePath: "https://funfish-my.sharepoint.com/drives/b!l3_CjXxMqk20dANIn7_HawyVEl8hjHpLv81HYuYVG68Q3hXEIAoZTrdi5GkbEwAJ/root:",
                        //         // listPath: "{C415DE10-0A20-4E19-B762-E4691B130009}",
                        //     //     itemPath: "THE-ITEM-PATH"
                        //     }
                        // },
                        // sourceTypes: "Sites", /* or an array like ["OneDrive", "Sites"] */
                        disable: this.disableNavigation
                    },
                    endpointHint: this.endpointHint,
                    
                },
                success: (files) => { 
                    // console.info('odrive success',files)
                    // resolve(files); 
                    this.$emit('input',files.value)
                },
                cancel: function () {
                    // resolve(null);
                },
                error: function (e) {
                    // reject(e); 
                    // console.info('odrive error',e)
                }
            }
            
            // console.info('odOptions',odOptions)

            if(OneDrive) {
                OneDrive.open(odOptions);
            }
        }
    },
    computed: {
        ...mapGetters('auth',['user']),
        queryParameters() {
            if(!this.endpointHint) {
                return "select=id,name,size,file,folder,photo,@microsoft.graph.downloadUrl,webUrl,@microsoft.graph.sourceUrl,parentReference,shared,listItem,root"
            } else {
                return ""
            }
        }
    },
    watch: {

    },
    mounted: function() {
        let oneDriveScript = document.createElement('script')
        oneDriveScript.setAttribute('src', 'https://js.live.net/v7.2/OneDrive.js')
        document.head.appendChild(oneDriveScript)
    }
}
</script>