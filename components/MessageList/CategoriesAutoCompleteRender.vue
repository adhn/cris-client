<template>
<div>
    <v-autocomplete
        v-model="selected"
        :loading="isUpdating"
        :items="items"
        :chips="displayAutoSuggestions"
        label="Companies and Projects"
        item-text="name"
        item-value="category_id"
        multiple
        dense
        :readonly="!isEditing"
    >
        <!-- @change="changed()" -->
        <template v-if="categorized">
            <v-slide-x-reverse-transition
                slot="append-outer"
                mode="out-in"
            >
                <v-icon
                :color="isEditing ? 'success' : 'info'"
                :key="`icon-${isEditing}`"
                @click="isEditing = !isEditing"
                >
                    <template v-if="isEditing">
                        check_circle_outline
                    </template>
                    <template v-else>
                        edit
                    </template>
                </v-icon>
            </v-slide-x-reverse-transition>
        </template>
        <!-- <template v-if="!categorized"> -->
            <template slot="selection" slot-scope="data">
                <v-chip
                    :selected="data.selected"
                    :close=isEditing
                    small
                    class="chip--select-multi"
                    @input="remove(data.item)"
                >
                    {{ data.item.name }}
                </v-chip>
            </template>
        <!-- </template> -->
        <template slot="item" slot-scope="data">
            <template v-if="typeof data.item !== 'object'">
                <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
                <v-list-tile-avatar>
                    <template v-if="data.item.__typename == 'Project'">
                        <v-icon>assignment</v-icon>
                    </template>
                    <template v-if="data.item.__typename == 'Company'">
                        <v-icon>account_balance</v-icon>
                    </template>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                    <!-- <v-list-tile-sub-title v-html="data.item.__typename"></v-list-tile-sub-title> -->
                </v-list-tile-content>
            </template>
        </template>
    </v-autocomplete>
<template v-if="!categorized">
    <template v-for="category_id in message.category_suggestions">
        <v-chip :key="category_id" small @click="addToSelected(event,category_id)">{{getCategoryFromItemsById(category_id)}}</v-chip>
    </template>
</template>



</div>
</template>


<script>
export default {
    props: ['items','message','storeName','displayAutoSuggestions'],
    data: () => ({
        autoUpdate: true,
        selected: [],
        isUpdating: false,
        messageId: null,
        categorized: false,
        isEditing: false
    }),
    computed: {

    },
    methods: {
      remove (item) {
        const index = this.selected.indexOf(item.category_id)
        if (index >= 0) this.selected.splice(index, 1)
      },
      addToSelected(event,category_id) {
        // console.info(event,category_id)
        this.selected.push(category_id)
        this.changed()
      },
      changed() {
          console.info('changed selected',this.selected)
        // this.selected is an array of selected category_ids 
        this.isUpdating = true
        this.$store.dispatch('message_list/updateCategories',{
            messageId: this.messageId,
            selectedCategories: this.selected
        }).then(() => {
            this.isUpdating = false
            console.info('categories updated caused by user input')
        })
      },
      getCategoryFromItemsById(category_id) {
            let cat = _.find(this.items, function(item) {
                return item.category_id === category_id;
            })
            if(cat) {
                return cat.name
            } else {
                return category_id
            }
      },
      messageUpdated(message) {
            // console.info('message changed')
            // if(this.displayAutoSuggestions) {
            //     this.isEditing = true
            // }

            this.messageId = message.id
            let selected = []
            // selecting categories already applied on message
            let project_categories = _.map(message.projects, 'category_id')
            selected.push(...project_categories)
            let companies_categories = _.map(message.companies,'category_id')
            selected.push(...companies_categories)
            // console.info(items)\

            let diff = _.xor(selected, this.selected);
            if(diff.length > 0) {
                // console.info('messageUpdated selected has changed',this.selected,selected)
                this.selected = selected
            }
        }
    },
    watch: {
        message: function(val,oldVal) {
            this.messageUpdated(val)
        },
        selected: function(val,oldVal) {
            this.changed()
        }
    },
    created: function () {
        this.messageUpdated(this.message)
        if(this.selected.length > 0) {
                this.categorized = true
                this.isEditing = false
        } else {
                this.isEditing = true
                this.categorized = false
        }
    }
}
// message.category_suggestions is array with category ids as value
// items are categories
</script>