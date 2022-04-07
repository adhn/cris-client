<template>
<span>
    {{ renderProjects(item) }}
</span>
</template>
<script>
export default {
    props: ['item'],
    methods: {
        renderProjects(item) {
            if (_.isArray(item.projects) && !_.isEmpty(item.projects)) {
                let projects = []
                let self = this
                _(item.projects).forEach(function (project) {
                    let projectRole = self.getProjectRole(project.project_role_id)
                    console.info(projectRole)
                    if(projectRole) {
                        projects.push(projectRole+'@'+project.name)
                    } else {
                        projects.push(project.name);
                    }
                });
                return _.join(projects, ', ');
            }
        },
        getProjectRole(projectRoleId) {
            let projectRole = this.$store.getters['project_role_field/getProjectRoleById'](projectRoleId)
            if(projectRole) {
                return projectRole.role
            } else {
                return null
            }

        }
    },

}
</script>