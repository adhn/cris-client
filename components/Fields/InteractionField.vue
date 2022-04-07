<template>
          <v-autocomplete
            :value="value"
           @change="onChange($event)"
          :items="interactions"
          :loading="loading"
          :label="this.label"
          item-text="title"
          item-value="id"
          :multiple="multiple"
          >
          </v-autocomplete>
</template>
<script>
    import {mapGetters} from 'vuex';
// https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
    export default {
        components: {},
        props: ['label','value','multiple'],
        computed: {
            ...mapGetters('interaction_field',['interactions','loading'])
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            }
        }
    }
</script>