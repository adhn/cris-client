<template>
    <v-layout row>
        <v-flex p>
            <v-btn icon :disabled="disabled" @click="merge()"><v-icon>reply</v-icon>
            </v-btn>
        </v-flex>
        <v-flex xs12>
            <v-text-field readonly :value="value" :label="label"></v-text-field>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    props: ['fieldName','label','value'],
    computed: {
        disabled() {
            if(this.value) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        merge() {
            let parts = this.fieldName.split(".")
            if(parts[0] == this.fieldName) {
                let obj = {}
                obj[this.fieldName] = this.value
                this.$store.commit('contact/updateContact',obj)
            } else {
                if (parts[0] == 'phones') {
                    console.info('phone parts',parts)
                    let field = parts[1]
                    let key = parts[2] // index 
                    this.updatePhone(field,key,this.value)
                }
            }
        },
        updatePhone(field,key,e) {
            this.$store.commit('contact/updatePhone',{
                field: field,
                key: key,
                value: e
            })
        }
    },

}
</script>