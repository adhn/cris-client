<template>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :multi-line="multiLine"
      :timeout="timeout"
      :vertical="vertical"
      :absolute="absolute"
      :bottom="bottom"
    >
      {{ text }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
</template>
<script>
    import {VSnackbar} from 'vuetify'
    import {mapState, mapMutations,mapGetters} from 'vuex';
    export default {
        components: { VSnackbar },
        data: () => ({
            absolute: false,
            bottom: true
        }),
        computed: {
            ...mapGetters('feedback_snackbar',['color','multiLine','timeout','vertical','text']),
            snackbar: {
                get() { return this.$store.getters['feedback_snackbar/snackbar']},
                set(val) { this.$store.commit('feedback_snackbar/snackbar',val)}
            }
        }
    }
</script>