<template>
<v-progress-linear :value="percentage"></v-progress-linear>
</template>
<script>

    export default {
        props: ['todo','total'],
        components: {
            
        },
        data: () => ({

        }),
        methods: {

        },
        computed: {
            percentage() {
                if(this.total == 0 || (this.total-this.todo == 0)) {
                    return 0
                } else {
                    return (this.total-this.todo) / this.total * 100 
                }
            }
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>


                      
