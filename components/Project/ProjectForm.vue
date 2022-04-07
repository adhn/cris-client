<template>
<div>
        <v-layout row mb-3>
            <template v-if="id">
                <v-flex xs12 class="mb-3">
                    <v-card>
                        <v-card-title>
                            <h2>{{name}}</h2>
                        </v-card-title>
                    </v-card>
                </v-flex>
            </template>
        </v-layout>



            
        <project-form-main-information class="mb-3" />
        
        <template v-if="showBondInformationAndFeeStructure">
            <project-form-bond-information class="mb-3" />
            <project-form-transaction-structure class="mb-3" />
            <project-form-fee-structure class="mb-3" />
        </template>

        <v-layout column class="fab-container">
                <!-- <v-btn class="" color="secondary" fab dark :to="{name: 'projects-id'}">
                    <v-icon>close</v-icon>
                </v-btn> -->

                    <v-btn color="secondary" fab dark @click.native="close">
                        <v-icon>close</v-icon>
                    </v-btn>


                <v-btn class="" color="primary" fab dark @click.native="save().then(edit())">
                    <v-icon>save</v-icon>
                </v-btn>
        </v-layout>
</div>
</template>

<script>
    import ProjectFormMainInformation from '~/components/Project/ProjectFormMainInformation.vue'
    import ProjectFormBondInformation from '~/components/Project/ProjectFormBondInformation.vue'
    import ProjectFormTransactionStructure from '~/components/Project/ProjectFormTransactionStructure.vue'
    import ProjectFormFeeStructure from '~/components/Project/ProjectFormFeeStructure.vue'

    import ProjectFormCompanies from '~/components/Project/ProjectFormCompanies.vue'
    import ProjectFormContacts from '~/components/Project/ProjectFormContacts.vue'

    import {mapGetters} from 'vuex';
    export default {
        components: {ProjectFormMainInformation,ProjectFormBondInformation,ProjectFormTransactionStructure,ProjectFormFeeStructure,ProjectFormCompanies,ProjectFormContacts},
        methods: {
            save() {
                return this.$store.dispatch('project/save')
            },
            edit() {
                    this.$router.push({ name: 'projects-edit-id', params: { id: this.id }})
            },
            close() {
                if(this.id) {
                    this.$router.push({ name: 'projects-id', params: { id: this.id }})
                } else {
                    this.$router.push({ name: 'projects'})
                }
            }
        }, 
        computed: {
            ...mapGetters('project',['id','name','project_type_id','showBondInformationAndFeeStructure']),
            
        }
    }
</script>
<style>
  .fab-container {
    position: fixed;
    top: 64px;
    right: 0;
  }
</style>