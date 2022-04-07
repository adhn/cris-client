<template>
            <v-card flat>
                <v-card-title>
                    <h3>Projects and Project Roles</h3>

                </v-card-title>
                <v-card-text>
                <template v-for="(item,key) in contactProjects">
                    <v-layout v-bind:key="key" row wrap>
                        <v-flex xs6 >
                            <v-select
                            :disabled="readonly"
                            :items="projects"
                            label="Project"
                            item-value="id"
                            item-text="name"
                            :value="item.id"
                            @input="updateProject('id',key,$event)"
                            ></v-select>
                        </v-flex>
                        <v-flex xs5 pl-3>
                             <v-select
                             :disabled="readonly"
                            :items="projectRoles"
                            label="Project Role"
                            item-value="id"
                            item-text="role"
                            :value="item.project_role_id"
                            @input="updateProject('project_role_id',key,$event)"
                            :clearable="!readonly"
                            ></v-select>

                        </v-flex>

                            <v-spacer></v-spacer>
                        <template v-if="!readonly">
                            <v-btn outline small dark color="primary" icon @click="remove(item,key)">
                                <v-icon>remove</v-icon>
                            </v-btn>
                        </template>
                    </v-layout>
                </template>
                </v-card-text>
                <v-card-actions>
                    <template v-if="!readonly">
                        <v-btn fab small outline dark color="primary" @click="add">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </template>
                </v-card-actions>
            </v-card>
</template>
<script>
    import {mapGetters} from 'vuex';
    import ProjectRoleField from '~/components/Fields/ProjectRoleField.vue'

    export default {
        components: {ProjectRoleField},
        data: () => ({

        }),
        computed: {
            ...mapGetters('contact',[
                'projects','projectRoles','contactProjects','readonly'
            ]),
        },
        methods: {
            add() {
                this.$store.commit('contact/addProject')
            },
            remove(item,key) {
                this.$store.commit('contact/removeProject',{
                    // item: item,
                    key: key
                })
            },
            updateProject(field,key,e) {
                console.info(e,field,key)
                this.$store.commit('contact/updateProject',{
                    field: field,
                    key: key,
                    value: e
                })
            }

        },
        mounted() {
        },
    }
</script>