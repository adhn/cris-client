<template>
    <v-autocomplete
            :items="companies"
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
        props: ['value','label','multiple','issuerCompaniesOnly'],
        components: {},
        computed: {
            ...mapGetters('company_field',['loading']),
            companies: {
                get() {
                    if(this.issuerCompaniesOnly) {
                        return this.$store.getters['company_field/issuerCompanies']
                    } else {
                        return this.$store.getters['company_field/companies']
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