<template>
<div>
     <v-toolbar app color="white" prominent>
       <v-toolbar-title>
          Dashboard - {{formatDate(dateFrom)}} - {{formatDate(dateTo)}}
       </v-toolbar-title>
        <v-flex lg1>
            <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
        </v-flex>
      <v-spacer />
      <v-flex lg1>
        <v-btn v-shortkey.once="['arrowleft']" @shortkey="$refs.calendar.prev()" outline large left color="primary" @click="$refs.calendar.prev()">
          <v-icon dark>keyboard_arrow_left</v-icon>
        </v-btn>
      </v-flex>

      <v-flex lg1>
        <v-btn v-shortkey.once="['arrowright']" @shortkey="$refs.calendar.next()" outline large right color="primary" @click="$refs.calendar.next()">
          <v-icon dark>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-flex>

      <v-flex lg1>
        <v-select v-model="type" :items="typeOptions" label="Type"></v-select>
      </v-flex>

    <!-- <v-flex sm12 lg3 class="pa-3 mb-3 feature-pane" >
      <v-btn fab outline small absolute left color="primary" @click="$refs.calendar.prev()">
        <v-icon dark>keyboard_arrow_left</v-icon>
      </v-btn>

      <v-btn fab outline small absolute right color="primary" @click="$refs.calendar.next()">
        <v-icon dark>keyboard_arrow_right</v-icon>
      </v-btn>

      <v-checkbox v-model="dark" label="Dark"></v-checkbox>
      <v-select v-model="color" :items="colorOptions" label="Color"></v-select>
      <v-select v-model="weekdays" :items="weekdaysOptions" label="Weekdays"></v-select>
      <v-text-field v-if="type === 'custom-weekly'" v-model="minWeeks" label="Minimum Weeks" type="number"></v-text-field>
      <v-select v-if="hasIntervals" v-model="intervals" :items="intervalsOptions" label="Intervals"></v-select>
      <v-select v-if="type === 'custom-daily'" v-model="maxDays" :items="maxDaysOptions" label="# of Days"></v-select>
      <v-select v-if="hasIntervals" v-model="styleInterval" :items="styleIntervalOptions" label="Styling"></v-select>
    </v-flex> -->

     </v-toolbar>
<v-layout row wrap>
    <v-flex sm12 lg12 class="pl-3">
      <v-sheet height="500">
        <v-calendar
          ref="calendar"
          v-model="today"
          :type="type"
          :min-weeks="minWeeks"
          :max-days="maxDays"
          :dark="dark"
          :weekdays="weekdays"
          :first-interval="intervals.first"
          :interval-minutes="intervals.minutes"
          :interval-count="intervals.count"
          :interval-height="intervals.height"
          :interval-style="intervalStyle"
          :show-interval-label="showIntervalLabel"
          :color="color"
          :loading="loading"
          @change="onChange"
        >
        <!-- dayHeader and dayBody slots are for week view only -->
          <!-- the events at the top (all-day) -->
          <template v-slot:dayHeader="{ date }">
            <template v-for="event in events[date]">
              <!-- all day events don't have time -->
              <div
                v-if="!event.time"
                :key="event.title"
                class="my-event"
                @click="open(event)"
                v-html="event.title"
              ></div>
            </template>
          </template>
          <!-- the events at the bottom (timed) -->
          <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
            <template v-for="event in events[date]">
              <!-- timed events -->
              <div
                v-if="event.time"
                :key="event.title"
                :style="{ top: timeToY(event.time) + 'px', height: minutesToPixels(event.duration) + 'px' }"
                class="my-event with-time"
                @click="open(event)"
                v-html="event.title"
              ></div>
            </template>
          </template>
          <!-- day slot is for month view only -->
            <template v-slot:day="{ date }">
              <template v-for="event in events[date]">
                <v-menu :key="event.id" v-model="event.open" full-width offset-x >
                  <template v-slot:activator="{ on }">
                    <div v-if="!event.time" v-ripple class="my-event" v-on="on"><EventIconRenderer :id="event.id" :event="event" />{{event.title}}</div>
                  </template>
                  <v-card color="grey lighten-4" min-width="350px" flat>
                    <!-- <v-toolbar color="primary" dark>
                      <v-btn icon><v-icon>edit</v-icon></v-btn>
                      <v-toolbar-title v-html="event.title"></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn icon><v-icon>favorite</v-icon></v-btn>
                      <v-btn icon><v-icon>more_vert</v-icon></v-btn>
                    </v-toolbar> -->
                    <v-card-title primary-title>
                      <span v-html="event.id">event.id</span>
                    </v-card-title>
                    <v-card-actions>
                      <!-- <v-btn flat color="secondary">Cancel</v-btn> -->
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </template>
        </v-calendar>
      </v-sheet>
    </v-flex>
  </v-layout>
</div>
</template>
<script>
  const weekdaysDefault = [0, 1, 2, 3, 4, 5, 6]

  const intervalsDefault = {
    first: 0,
    minutes: 60,
    count: 24,
    height: 40
  }

  const stylings = {
    default (interval) {
      return undefined
    },
    workday (interval) {
      const inactive = interval.weekday === 0 ||
        interval.weekday === 6 ||
        interval.hour < 9 ||
        interval.hour >= 17
      const startOfHour = interval.minute === 0
      const dark = this.dark
      const mid = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'

      return {
        backgroundColor: inactive ? (dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)') : undefined,
        borderTop: startOfHour ? undefined : '1px dashed ' + mid
      }
    },
    past (interval) {
      return {
        backgroundColor: interval.past ? (this.dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)') : undefined
      }
    }
  }

    import {mapGetters} from 'vuex'
    import moment from 'moment';
    import EventIconRenderer from '~/components/Dashboard/EventIconRenderer.vue'
    import DateRangeField from '~/components/Fields/DateRangeField.vue'

  export default {
    components:{
      EventIconRenderer,
      DateRangeField

    },
    data: () => ({
      today: moment().utc(true).format('YYYY-MM-DD'), 
      dark: false,
      startMenu: false,
    //   start: null,
      start: moment().startOf('month').utc(true).format('YYYY-MM-DD'),
    //   endMenu: false,
      end: moment().endOf('month').utc(true).format('YYYY-MM-DD'),
      nowMenu: false,
      minWeeks: 1,
      now: moment().utc(true).format('YYYY-MM-DD'),
      type: 'month',
      typeOptions: [
        // { text: 'Day', value: 'day' },
        // { text: '4 Day', value: '4day' },
        { text: 'Week', value: 'week' },
        { text: 'Month', value: 'month' },
        // { text: 'Custom Daily', value: 'custom-daily' },
        // { text: 'Custom Weekly', value: 'custom-weekly' }
      ],
      weekdays: weekdaysDefault,
      weekdaysOptions: [
        { text: 'Sunday - Saturday', value: weekdaysDefault },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] }
      ],
      intervals: intervalsDefault,
      intervalsOptions: [
        { text: 'Default', value: intervalsDefault },
        { text: 'Workday', value: { first: 16, minutes: 30, count: 20, height: 40 } }
      ],
      maxDays: 7,
      maxDaysOptions: [
        { text: '7 days', value: 7 },
        { text: '5 days', value: 5 },
        { text: '4 days', value: 4 },
        { text: '3 days', value: 3 }
      ],
      styleInterval: 'default',
      styleIntervalOptions: [
        { text: 'Default', value: 'default' },
        { text: 'Workday', value: 'workday' },
        { text: 'Past', value: 'past' }
      ],
      color: 'primary',
      colorOptions: [
        { text: 'Primary', value: 'primary' },
        { text: 'Secondary', value: 'secondary' },
        { text: 'Accent', value: 'accent' },
        { text: 'Red', value: 'red' },
        { text: 'Pink', value: 'pink' },
        { text: 'Purple', value: 'purple' },
        { text: 'Deep Purple', value: 'deep-purple' },
        { text: 'Indigo', value: 'indigo' },
        { text: 'Blue', value: 'blue' },
        { text: 'Light Blue', value: 'light-blue' },
        { text: 'Cyan', value: 'cyan' },
        { text: 'Teal', value: 'teal' },
        { text: 'Green', value: 'green' },
        { text: 'Light Green', value: 'light-green' },
        { text: 'Lime', value: 'lime' },
        { text: 'Yellow', value: 'yellow' },
        { text: 'Amber', value: 'amber' },
        { text: 'Orange', value: 'orange' },
        { text: 'Deep Orange', value: 'deep-orange' },
        { text: 'Brown', value: 'brown' },
        { text: 'Blue Gray', value: 'blue-gray' },
        { text: 'Gray', value: 'gray' },
        { text: 'Black', value: 'black' }
      ],
      dateRangeFieldValue: null
    }),
    computed: {
    ...mapGetters('calendar',['events','loading','dateFrom','dateTo']),

      intervalStyle () {
        return stylings[ this.styleInterval ].bind(this)
      },
      hasIntervals () {
        return this.type in {
          'week': 1, 'day': 1, '4day': 1, 'custom-daily': 1
        }
      },
      hasEnd () {
        return this.type in {
          'custom-weekly': 1, 'custom-daily': 1
        }
      },
    },
    methods: {
      showIntervalLabel (interval) {
        return interval.minute === 0
      },
      fetchEvents() {
        return this.$store.dispatch('calendar/fetchCalendarEvents')
      },
      formatDate(date) {
        // console.info('formatDate',date)
        return moment(date,"YYYY-MM-DD").format('Do MMMM YYYY')
      },

      onChange(dateRange) {
        // console.info('Calendar method onChange called')
        this.$store.commit('calendar/dateFrom',dateRange.start.date)
        this.$store.commit('calendar/dateTo',dateRange.end.date)
        this.dateRangeFieldValue = [
          dateRange.start.date,
          dateRange.end.date
        ],
        this.fetchEvents()      
      }
    },
    watch: {
        start(val,oldVal) {
            // console.info('start',val,oldVal)
        },
        type(val,oldVal) {
          if(val != oldVal) {
            switch(val) {
              case 'week':
                this.start = moment().startOf('week').utc(true).format('YYYY-MM-DD')
                this.end = moment().endOf('week').utc(true).format('YYYY-MM-DD')
                this.today = moment().utc(true).format('YYYY-MM-DD') 
                this.fetchEvents()
                break
              case 'month':
                this.start = moment().startOf('month').utc(true).format('YYYY-MM-DD')
                this.end = moment().endOf('month').utc(true).format('YYYY-MM-DD')
                this.today = moment().utc(true).format('YYYY-MM-DD') 
                this.fetchEvents()
                break      
              default:
                this.start = moment().startOf('month').utc(true).format('YYYY-MM-DD')
                this.end = moment().endOf('month').utc(true).format('YYYY-MM-DD')
                this.today = moment().utc(true).format('YYYY-MM-DD') 
                this.fetchEvents()
                break      
            }
          }
        }
    },
    created: function() {
        this.$store.commit('calendar/dateFrom',this.start)
        this.$store.commit('calendar/dateTo',this.end)
        this.dateRangeFieldValue = [
          this.start,
          this.end
        ]
        this.fetchEvents()  
    }
  }
</script>

<style scoped>

  .feature-pane {
    position: relative;
    padding-top: 30px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  }

  .day-header {
    margin: 0px 2px 2px 2px;
    padding: 2px 6px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    border-radius: 2px;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .day-body {
    position: absolute;
    top: 400px;
    height: 36px;
    margin: 2px;
    padding: 2px 6px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    border-radius: 2px;
    left: 0;
    right: 0;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .day {
    position: relative;
    height: 24px;
    margin: 0px;
    padding: 0px 6px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    border-radius: 2px;
    left: 0;
    right: 0;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

</style>
<style lang="stylus" scoped>
  .my-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    width: 100%;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
  }
</style>