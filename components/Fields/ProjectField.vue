<template>
    <v-autocomplete
            :items="projects"
            :value="value"
            @change="onChange($event)"
            :label="this.label"
            item-value="id"
            item-text="name"
            v-bind:loading="loading"
            v-bind:clearable="clearable"
            :multiple="multiple"
            :readonly="readonly"
    ></v-autocomplete>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        props: ['value','label','multiple','readonly','clearable'],
        components: {},
        computed: {
            ...mapGetters('project_field',['projects','loading'])
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            },
        }
    }
</script>