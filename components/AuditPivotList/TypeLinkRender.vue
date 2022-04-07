<template>
<span>
        <router-link :to="this.getRoute()">
                {{this.getType()}} : {{this.getId()}}
        </router-link>
        <template v-if="this.item.new_values && !(this.item.new_values == 'null' || this.item.new_values == '[]')">
         -- ({{this.item.new_values}})
         </template>
</span>
</template>
<script>
export default {
    props: {
        item: {
            type: Object
        },
    },
    methods: {
        getType() {
            let fieldTypeName = this.$store.getters['audit_pivot_list/getFieldTypeName']
            if(this.item && this.item[fieldTypeName]) return this.item[fieldTypeName]
        },
        getId() {
            let fieldIdName = this.$store.getters['audit_pivot_list/getFieldIdName']
            if(this.item && this.item[fieldIdName]) return this.item[fieldIdName]
        },
        getRoute() {
            let type = this.getType();
            if(type) {
                switch(type) {
                    case 'App\\Contact':
                        return { name: 'contacts-id', params: { id: this.getId() }}
                        break
                    case 'App\\Company':
                        return { name: 'companies-id', params: { id: this.getId() }}
                        break
                    case 'App\\Project':
                        return { name: 'projects-id', params: { id: this.getId() }}
                        break
                    case 'App\\Interaction':
                        return { name: 'interactions-id', params: { id: this.getId() }}
                        break
                }
            }
        }

    },
    mounted: function() {
        // console.info('type link render mounted',this.item)
    }
}
</script>