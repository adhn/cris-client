<template>
<span>
    <v-icon color="white">{{icon}}</v-icon>
    <template v-if="event.tentative"><v-icon color="white">explore</v-icon></template>
</span>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        props: ['id','event'],
        data: () => ({
            typeIconMap: {
                'ChecklistItem': 'check_box_outline_blank',
                'Checklist': 'list',
                'Project': 'assignment',
                'Event': 'event_available'
            }
        }),
        computed: {
            icon() {
                let [type,id] = this.id.split(':')
                if(this.typeIconMap.hasOwnProperty(type)) {
                    return this.typeIconMap[type]
                }
            }
        },

    }
</script>