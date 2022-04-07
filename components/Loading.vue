<template>
   <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card color="primary" dark >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>
<script>
    // import {V} from 'vuetify'
    import {mapState, mapMutations,mapGetters} from 'vuex';
    export default {
        components: { },
        data: () => ({
            absolute: false,
            bottom: true
        }),
        computed: {
            // ...mapGetters('feedback_snackbar',['color','multiLine','timeout','vertical','text']),
            dialog: {
                get() { return this.$store.getters['loading/loading']},
                set(val) { this.$store.commit('loading/loading',val)}
            }
        }
    }
</script>