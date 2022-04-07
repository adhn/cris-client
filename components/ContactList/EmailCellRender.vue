<template>
<span>
    <template v-if="hasEmailAddresses(item)">
        <!-- <v-icon color="grey">email</v-icon> -->
        <template v-for="email in cleanEmails(item)">
                <a :key="email[fieldName]" :href=toHref(email)>{{email[fieldName]}}</a>
                <br :key="email[fieldName]+'br'" />
        </template>
    </template>
</span>
</template>
<script>
export default {
    props: {
        item: {
            type: Object
        },
        fieldName: {
            default: 'email',
            type: String
        }
    },
    methods: {
        hasEmailAddresses(item) {
            let emailAddresses = item.emailAddresses;
            return _.isArray(emailAddresses) && !_.isEmpty(emailAddresses) 
        },
        cleanEmails(item) {
            return _.uniqBy(item.emailAddresses, this.fieldName); 
        },
        toHref(email) {
            return 'mailto:'+email[this.fieldName]
        },

        renderEmail(email_addresses) {
            if (_.isArray(email_addresses) && !_.isEmpty(email_addresses)) {
                let emails = []
                _(email_addresses).forEach(function (email) {
                    emails.push(email[this.fieldName]);
                });
                return _.join(emails, ',');
            }
        }
    }
}
</script>