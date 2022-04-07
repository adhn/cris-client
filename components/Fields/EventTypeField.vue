<template>
          <v-autocomplete
          :items="eventTypes"
          :loading="loading"
          item-text="name"
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
        props: ['value','label','multiple','clearable'],
        components: {},
        computed: {
            ...mapGetters('event_type_field',['loading','eventTypes']),
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            },
        }
    }
</script>