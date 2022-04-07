<template>
          <v-autocomplete
          :items="projectRoles"
          :loading="loading"
          item-text="role"
          item-value="id"
          :value="value"
          @change="onChange($event)"
          :label="this.label"
          :multiple="multiple"
          :clearable="clearable"
          >
          </v-autocomplete>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        props: ['value','label','multiple','filtered','clearable'],
        components: {},
        computed: {
            ...mapGetters('project_role_field',['loading']),
            projectRoles: {
                get() { 
                    if(this.filtered) {
                        return this.$store.getters['project_role_field/filteredProjectRoles'] 
                    } else {
                        return this.$store.getters['project_role_field/projectRoles'] 
                    }
                },
            },
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            },
        }
    }
</script>