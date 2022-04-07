<template>
    <v-btn :to="to" color="white" :disabled="disabled">
        <v-badge color="red" left overlap>

            <span v-if="!disabled" slot="badge">{{trashedCount}}</span>

            <v-icon x-large color="lighten-1" large>delete_outline</v-icon>
        </v-badge>
    </v-btn>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        props: ['to'],
        data: () => ({

        }),
        computed: {
            ...mapGetters('project_list',['trashedCount']),
            disabled: {
                get() { return this.$store.getters['project_list/trashedCount'] == 0 },
                set() {}
            }
        },

    }
</script>