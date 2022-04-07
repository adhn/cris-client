<template>
    <v-autocomplete
            :items="checklistTemplates"
            :value="value"
            @change="onChange($event)"
            :label="this.label"
            item-value="id"
            item-text="name"
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
            ...mapGetters('checklist_template_field',['checklistTemplates','loading'])
        },
        methods: {
            onChange(value) {
                this.$emit('input',value)
            },
        }
    }
</script>