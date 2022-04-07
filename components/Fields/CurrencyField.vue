<template>
          <v-autocomplete
            :value="value"
           @change="onChange($event)"
          :items="currencies"
          :loading="loading"
          :label="this.label"
          item-text="code"
          item-value="id"
          >
          </v-autocomplete>
</template>
<script>
    import {mapGetters} from 'vuex';
// https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
    export default {
        components: {},
        props: ['label','value'],
        computed: {
            ...mapGetters('currency_field',['currencies','loading'])
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            }
        }
    }
</script>