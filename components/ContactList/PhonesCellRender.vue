<template>
<span>

<template v-if="hasHomePhones(item)">
    <v-icon color="grey">home</v-icon>
    <template v-for="phone in item.home_phones">
            {{phone}}&nbsp;&nbsp;
    </template>
    <br />
</template>
<template v-if="hasBusinessPhones(item)">
    <v-icon color="grey">business</v-icon>
    <template v-for="phone in item.business_phones">
            {{phone}}&nbsp;&nbsp;
    </template>
    <br />
</template>
<template v-if="item.mobile_phone">
    <v-icon color="grey">smartphone</v-icon>
    {{item.mobile_phone}}
</template>


</span> 
</template>
<script>
export default {
    props: ['item'],
    methods: {
        hasContent(arr) {
            arr = _.compact(arr)
            if (!_.isEmpty(arr)) {
                return true
            } else {
                return false
            }
        },
        hasBusinessPhones(item) {
            return this.hasContent(item.business_phones)            
        },
        hasHomePhones(item) {
            return this.hasContent(item.home_phones)
        },
        countPhones(item) {
            let count = 0;
            count =+ hasContent(item.business_phones) ? item.business_phones.len : 0
            count =+ hasContent(item.home_phones) ? item.home_phones.len : 0
            count =+ item.mobile_phone ? 1 : 0
            return count
        },

        // renderPhones(item) {
        //     let out = [];
        //     if (_.isArray(item.business_phones) && !_.isEmpty(item.business_phones)) {

        //         out.push('B: ' + _.join(item.business_phones, ','))
        //     }

        //     if (_.isArray(item.home_phones) && !_.isEmpty(item.home_phones)) {
        //         out.push('H: ' + _.join(item.home_phones, ','))
        //     }

        //     if (item.mobile_phone) {
        //         out.push('M: ' + item.mobile_phone)
        //     }

        //     return _.join(out, " | ")
        // },
    }
}
</script>