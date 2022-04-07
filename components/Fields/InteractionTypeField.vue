<template>
          <v-autocomplete
          :value="value"
          @change="onChange($event)"
          :items="interactionTypes"
          :loading="loading"
          :label="this.label"
          item-text="name"
          item-value="id"
          >
          </v-autocomplete>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        props:['value','label'],
        components: {},
        computed: {
            ...mapGetters('interaction_type_field',['interactionTypes','loading'])
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            },
        }
    }
</script>