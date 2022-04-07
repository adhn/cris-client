<template>
            <v-menu
            class="date-range-field-display-block-fix"
            :close-on-content-click="false"
            v-model="menu"
            :nudge-left="100"
            offset-y
            lazy
            transition="scale-transition"
            >
            <v-text-field
                slot="activator"
                v-model="formatted"
                :label="label"
                persistent-hint
                append-icon="event"
                :clearable="true"
                :readonly="!enabled"
            ></v-text-field>
            <!-- <v-date-picker :readonly="!enabled" v-model="date" no-title @input="menu = false"></v-date-picker> -->
                <v-card>
                    <v-card-text>
                        <v-daterange :options="dateRangeOptions" @input="onDateRangeChange" :no-presets="true" :highlight-range="true" />     
                    </v-card-text>
                </v-card>
            </v-menu>
</template>
<script>
    import moment from 'moment';
    export default {
        props: {
            value: {
                type: Array
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
            dateFrom: '',
            dateTo: '',
            dateRange: [],
            formatted: '',
            menu: false,
            // date: null,
            // initialDate: null,
            dateRangeOptions: {
                startDate: '', // In YYYY-MM-DD format. Prefill value for start date picker.
                endDate: '', // In YYYY-MM-DD format. Prefill value for end date picker.
                minDate: '', // The minimum date a user can select in YYYY-MM-DD format.
                maxDate: '',  // The maximum date a user can select in YYYY-MM-DD format. If not provided, it defaults to TODAY.
                format: 'DD/MM/YYYY', // String. The format in which you want the user to see the dates in the inputs. E.g. MM/DD/YYYY.
                presets: [] // Array. An array of preset values like Today, Yesterday etc. It's an array of object that looks like this.

            }
        }),
        components: {},
        computed: {

        },
        methods: {
            // formatDate (date) {
            //     if (!date) return null

            //     const [year, month, day] = date.split('-')
            //     return `${day}/${month}/${year}`
            // },
            // parseDate (date) {
            //     if (!date) return null

            //     const [day, month, year] = date.split('/')
            //     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            // },
            removeTime(dateTimeValue) {
                let datetime = moment(dateTimeValue);
                let dateComponent = datetime.utc(true).format('YYYY-MM-DD');
                return dateComponent
            },
            onDateRangeChange(dateRange) {
                // console.info('onDateRangeChange dateRange',dateRange)
                this.dateRange = dateRange
                this.setFormatted(dateRange)
                this.$emit('input',dateRange)
            },
            setFormatted(dateRange) {
                let formatted = ''
                if(dateRange && dateRange[0]) {
                    this.formatted = dateRange[0]
                }
                
                if(dateRange && dateRange[1]) {
                    this.formatted = this.formatted+' - '+dateRange[1]
                }
            },
            valueChanged(value) {
                if(value) {
                    if(value[0]) {
                        let date = this.removeTime(value[0])
                        this.dateRange[0] = date
                    } else {
                        this.dateRange[0] = ''
                    }

                    if(value[1]) {
                        let date = this.removeTime(value[1])
                        this.dateRange[1] = date
                    } else {
                        this.dateRange[1] = ''
                    }

                    this.dateRangeOptions.startDate = this.dateRange[0]
                    this.dateRangeOptions.endDate = this.dateRange[1]
                    this.setFormatted(this.dateRange)
                }
            }
        },
        watch: {
            formatted(val,oldVal) {
                if(!val) {
                    this.dateRangeOptions.startDate = ''
                    this.dateRangeOptions.endDate = ''
                    this.dateFrom = ''
                    this.dateTo = ''
                    this.dateRange = ['','']
                    this.$emit('input',this.dateRange)
                }
            },
            dateRange(val,oldVal) {
                // this.setFormatted(val)
            },
            value(value,oldValue) {
                console.info('DateRangeField watch value')
                this.valueChanged(value)
            }

        },
        mounted: function () {
            this.valueChanged(this.value)
        }

    }
</script>
<style>
    .date-range-field-display-block-fix {
        display: block;
    }
</style>