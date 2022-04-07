<template>
    <v-autocomplete
            :items="settlementOptions"
            :value="value"
            @change="onChange($event)"
            :label="this.label"
            item-value="id"
            item-text="option"
            v-bind:loading="loading"
            v-bind:clearable="true"
            :multiple="multiple"
    ></v-autocomplete>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        props: ['value','label','multiple'],
        components: {},
        computed: {
            ...mapGetters('settlement_option_field',['loading','settlementOptions']),
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            },
        }
    }
</script>