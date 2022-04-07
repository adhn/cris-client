<template>
<span>
    {{ renderCompanies(item) }}
</span>
</template>
<script>
export default {
    props: ['item'],
    methods: {
        renderCompanies(item) {
            if (_.isArray(item.companies) && !_.isEmpty(item.companies)) {
                let companies = []
                _(item.companies).forEach(function (company) {
                    companies.push(company.name);
                });
                return _.join(companies, ',');
            }
        }
    }
}
</script>