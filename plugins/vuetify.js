import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import VueClipboard from 'vue-clipboard2'
import VDateRange from 'vuetify-daterange-picker';

Vue.use(require('vue-shortkey'))

Vue.use(VDateRange);

Vue.use(VueClipboard);

Vue.use(VueMoment, {
    moment,
})

import {
    Vuetify,
    VApp,
    VGrid,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VBtn,
    VDialog,
    VCard,
    VDataTable,
    VDataIterator,
    VTextField,
    VIcon,
    VAlert,
    VSelect,
    VMenu,
    VList,
    VProgressLinear,
    VProgressCircular,
    VSnackbar,
    VBadge,
    VTextarea,
    VSwitch,
    VAutocomplete,
    VChip,
    VTabs,
    VDatePicker,
    transitions,
    VCheckbox,
    VRadioGroup,
    VSubheader,
    VSheet,
    VCalendar,
    VDivider,
    VTooltip

    // VRadio
} from 'vuetify'

import { Ripple } from 'vuetify/lib/directives'


Vue.use(Vuetify, {
    components: {
        VApp,
        VGrid,
        VNavigationDrawer,
        VFooter,
        VToolbar,
        VBtn,
        VDialog,
        VCard,
        VDataTable,
        VDataIterator,
        VTextField,
        VIcon,
        VAlert,
        VSelect,
        VMenu,
        VList,
        VProgressLinear,
        VProgressCircular,
        VSnackbar,
        VBadge,
        VTextarea,
        VSwitch,
        VAutocomplete,
        VChip,
        VTabs,
        VDatePicker,
        transitions,
        VCheckbox,
        VRadioGroup,
        VSubheader,
        VSheet,
        VCalendar,
        VDivider,
        VTooltip

        // VRadio
    },
    directives: {
        Ripple
    }
});

let truncate = function(text, length, clamp){
    clamp = clamp || '...';
    return text.length > length ? text.slice(0, length) + clamp : text;
};

Vue.filter('truncate', truncate);



var UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
var STEP = 1024;

function format(value, power) {
    return (value / Math.pow(STEP, power)).toFixed(2) + UNITS[power];
}
let humanFileSize = function (value) {
    value = parseFloat(value, 10);
    for (var i = 0; i < UNITS.length; i++) {
        if (value < Math.pow(STEP, i)) {
            if (UNITS[i - 1]) {
                return format(value, i - 1);
            }
            return value + UNITS[i];
        }
    }
    return format(value, i - 1);
}
Vue.filter('human-file-size',humanFileSize)


let toTitleCase = (phrase) => {
    return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};
Vue.filter('toTitleCase',toTitleCase)

let iso8601DateToEuropeanFormat = function(value) {
    if(value) {
        let datetime = moment(value);
        return datetime.utc(true).format('DD/MM/YYYY');
    }
}
Vue.filter('iso-8601-date-to-european-format',iso8601DateToEuropeanFormat)


let boolToHuman = function(value) {
    return value ? 'Yes' : 'No' 
}
Vue.filter('boolToHuman',boolToHuman)

// To access vuex in route guard methods


import VueTimeago from 'vue-timeago'
Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en', // Default locale
  // We use `date-fns` under the hood
  // So you can use all locales from it
//   locales: {
//     'zh-CN': require('date-fns/locale/zh_cn'),
//     'ja': require('date-fns/locale/ja'),
//   }
})

Vue.config.performance = true

// yarn add vue-observe-visibility
// import { ObserveVisibility } from 'vue-observe-visibility';
// Vue.directive('observe-visibility', ObserveVisibility)
import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)
// import visibility from 'vue-visibility-change';
// registry directive
// Vue.use(visibility);
// global mode
// const handler = visibility.change((evt, hidden) => {
    // do something
    // console.info('global visibility hidden',hidden,evt)
// });

// let checkFocus = function() {
//     console.log(document.hasFocus());
// }

// window.addEventListener("focus", checkFocus);
// window.addEventListener("blur", checkFocus);
