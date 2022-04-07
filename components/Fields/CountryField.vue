<template>
          <v-autocomplete
            :value="value"
           @change="onChange($event)"
          :items="countries"
          :loading="loading"
          :label="this.label"
          item-text="name"
          item-value="id"
          solo>
          </v-autocomplete>
</template>
<script>
    import {mapGetters} from 'vuex';
// https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
    export default {
        components: {},
        props: ['label','value'],
        computed: {
            ...mapGetters('country_field',['countries','loading'])
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            }
        }
    }
</script>