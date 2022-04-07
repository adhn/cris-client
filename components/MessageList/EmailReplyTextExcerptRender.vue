<template>
    <span>{{excerpt | truncate(100,'....') }}</span>
</template>

<script>
import planer from 'planer'

export default {
    props: {
        htmlBody: {
            type: String
        }
    },
    computed: {
        excerpt() {
            console.info('generating excerpt')
            var replyHtml = planer.extractFrom(this.htmlBody, 'text/html', window.document);
            return this.strip(replyHtml) 
        }
    },
    methods: {
        strip(html){
            var doc = new DOMParser().parseFromString(html, 'text/html');
            return doc.body.textContent || "";
        }
    }
}
</script>