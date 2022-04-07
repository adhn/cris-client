<template>    
    <span>{{this.projectRole}}</span>
</template>
<script>
    import {mapGetters} from 'vuex';
    
    export default {
        props: ['project_role_id'],
        components: {
        },
        data: () => ({

        }),
        methods: {

        },
        computed: {
            projectRole: {
                get () { 
                    let projectRole = this.$store.getters['project_role_field/getProjectRoleById'](this.project_role_id)
                    if(projectRole) { 
                        return projectRole.role
                    } else {
                        return 'Not Found'
                    }
                }
            }
        },
        watch: {

        },
        mounted: function() {

        }
    }
</script>
