<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-btn slot="activator" flat color="primary"><v-icon>add</v-icon></v-btn>
        <v-card>

        <v-toolbar>

          <v-toolbar-title>Add new contact to company</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat color="" @click="dialog = false">
                Close
                <v-icon right>close</v-icon>
            </v-btn>
            <v-btn class ="ml-3" flat large color="primary" @click="save()">Save<v-icon right>save</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
            <v-card-text>
                <contact-form />
            </v-card-text>
        </v-card>
    </v-dialog>    
</template>
<script>

    // import EventForm from '~/components/Event/EventForm.vue'
    import ContactForm from '~/components/Contact/ContactForm.vue'

    export default {
        props: ['companyId'],
        components: {
            ContactForm
        },
        data: () => ({
            dialog: false,
        }),
        methods: {
            save() {
                this.$store.dispatch('contact/save').then(this.dialog = false)
            },
        },
        computed: {
            // project_id: {
            //     get () { return this.$store.getters['event/project_id'] },
            //     set (value) { this.$store.commit('event/project_id',value) }
            // },
            // name: {
            //     get () { return this.$store.getters['event/name'] },
            //     set (value) { this.$store.commit('event/name',value) }
            // },
        },
        watch: {
            dialog(value,oldValue) {
                if(value == true) {
                    let company_id = this.$store.getters['company/id']
                    // console.info('CompanyContactsNewDialog company_id',company_id)
                    // dialog has been opened
                    this.$store.commit('contact/reset'),
                    this.$store.commit('contact/newContact'),
                    
                    Promise.all([
                        this.$store.dispatch('contact/fetchData')
                    ]).then(data => {
                        this.$store.commit('contact/addCompany')
                        this.$store.commit('contact/updateCompany',{
                            field: 'id',
                            key: 0,
                            value: company_id
                        })
                    })
                }
                this.$store.commit('visibility/visible',!value)
            }
        },
        mounted: function() {

        }
    }
</script>