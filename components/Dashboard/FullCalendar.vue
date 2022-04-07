<template>    
    <v-layout row wrap>
        <v-flex xs12>
            <full-calendar :plugins="calendarPlugins" :events="events" />
        </v-flex>
    </v-layout>
</template>
<script>
    import {mapGetters} from 'vuex'
    import { FullCalendar } from 'vue-full-calendar'
    export default {
        props: [],
        components: {
            FullCalendar
        },
        data: () => ({
            calendarPlugins: []
        }),
        methods: {

        },
        computed: {
            ...mapGetters('calendar',['events'])
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
<style>
  @import 'fullcalendar/dist/fullcalendar.css';
</style>
