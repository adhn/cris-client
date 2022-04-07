<template>
        <calendar class="elevation-10"/>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Calendar from '~/components/Dashboard/Calendar.vue'
    export default {
        async fetch({ store, params }) {

        },
        data: () => ({

        }),
        components: {
            Calendar
        },
        computed: {
            ...mapGetters('auth',['user'])
        },
        mounted() {
            // let cookies = this.$cookiz.getAll()
        },
    }
</script>

