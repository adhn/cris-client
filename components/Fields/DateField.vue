<template>
            <v-menu
            :close-on-content-click="false"
            v-model="menu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            :disabled="!enabled"
            >
            <v-text-field
                slot="activator"
                v-model="formatted"
                :label="label"
                persistent-hint
                prepend-icon="event"
                @blur="date = parseDate(formatted)"
                :clearable="enabled"
                :readonly="!enabled"
            ></v-text-field>
            <v-date-picker :readonly="!enabled" v-model="date" no-title @input="menu = false"></v-date-picker>
            </v-menu>
</template>
<script>
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    export default {
        props: {
            value: {
                type: String
            },
            label: {
                type: String
            },
            enabled: {
                type: Boolean,
                default: true
            }
        },
        data: () => ({
            formatted: null,
            menu: false,
            date: null,
            initialDate: null
        }),
        components: {},
        computed: {

        },
        methods: {
            formatDate (date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            parseDate (date) {
                if (!date) return null

                const [day, month, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
            removeTime(dateTimeValue) {
                let datetime = moment(dateTimeValue);
                let dateComponent = datetime.utc(true).format('YYYY-MM-DD');
                return dateComponent
            } 
        },
        watch: {
            date(val,oldVal) {
                if(val != oldVal) {
                    if(this.enabled) {
                        if(this.initialDate !== val) {
                            // only emit input event if the date value is 
                            // different than the date passed into the value property

                            // this is to safeguard against triggering input events unnessecary 
                            // when initializing component with property value passed.
                            this.$emit('input',val)
                            this.initialDate = null
                            // after having changed the value away from its initialDate, clear initialDate
                            // so the date can be set back to its initialValue if the user so desires

                            // THIS LOGIC SMELLS!
                        }
                    }
                    this.formatted = this.formatDate(this.date)
                }
            } 
        },
        mounted: function () {
            if(this.value) {
                let date = this.removeTime(this.value)
                this.date = date
                this.initialDate = date
            }


        }

    }
</script>