<template>
    <iframe width="100%" frameBorder="0" ref="iframe" src="" />
</template>
<script>
export default {
    props: ['bodyContent','dialog'],
    computed: {
        iframeContent: function() {
            return blobObjectUrl(this.bodyContent)
        }
    },
    watch: {
        dialog: function (val,oldVal) {
            if(val) {
                console.info('message content watch dialog')
                this.injectContent()
                this.calculateHeight()
            }
        },
    },
    methods: {
            htmlStringAsDataUri: function(htmlString) {
                // this causes cross browser blocking
                // therefor we use blob object instead of data... see below
                var dataURI = 'data:text/html,' + encodeURIComponent(htmlString);
                return dataURI
            },
            htmlStringAsBlobObjectUrl: function(htmlString) {
                // https://stackoverflow.com/questions/41615320/why-does-chrome-rate-a-data-url-as-cross-origin
                // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
                // https://developer.mozilla.org/en-US/docs/Web/API/Blob
                var url = URL.createObjectURL(new Blob([htmlString], {type : 'text/html'}));
                return url
            },
            calculateHeight: function() {
                this.$refs.iframe.height = this.$refs.iframe.contentWindow.document.body.scrollHeight
            },
            injectContent: function() {
                // console.info('MessageContent mounted')
                this.$refs.iframe.src = this.htmlStringAsBlobObjectUrl(this.bodyContent)
                this.$refs.iframe.addEventListener('load',function(event) {
                    var iframe = event.target
                    iframe.height = iframe.contentWindow.document.body.scrollHeight
                })     
            }

    },
    mounted: function() {
   
    },
    created: function() {

    },
    updated: function() {
    }
}
</script>