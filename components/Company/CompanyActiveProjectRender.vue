<template>    
    <span>{{numActiveProjects}}</span>
</template>
<script>
    import {mapGetters} from 'vuex';
    import { filter } from 'lodash';

    export default {
        props: ['projects'],
        components: {
        },
        data: () => ({

        }),
        methods: {

        },
        computed: {
            numActiveProjects() {
                let activeProjects  = filter(this.projects, function(o) { 
                    return o.active; 
                });
                return activeProjects.length
            }
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
