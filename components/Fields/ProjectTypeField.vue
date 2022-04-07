<template>
          <v-autocomplete
          :value="value"
          @change="onChange($event)"
          :items="projectTypes"
          :loading="loading"
          :label="this.label"
          item-text="name"
          item-value="id"
          solo>
          </v-autocomplete>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        props:['value','label'],
        components: {},
        computed: {
            ...mapGetters('project_type_field',['projectTypes','loading'])
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            },
        }
    }
</script>