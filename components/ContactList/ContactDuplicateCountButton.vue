<template>
    <v-btn :to="to" color="white" :disabled="disabled">
        <v-badge color="red" left overlap>

            <span v-if="!disabled" slot="badge">{{count}}</span>

            <v-icon x-large color="lighten-1" large>compare_arrows</v-icon>
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
            ...mapGetters('duplicate_contacts',['count','duplicate_contacts']),
            disabled: {
                get() { return this.$store.getters['duplicate_contacts/count'] == 0 },
                set() {}
            }
        },
        mounted() {
            return this.$store.dispatch('duplicate_contacts/fetch')
        }

    }
</script>