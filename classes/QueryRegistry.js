var inherits = require("inherits");
var extend = require("extends");
import {POLL_INTERVAL} from '~/store/constants'

// https://jonnyreeves.co.uk/2014/simple-javascript-classes-in-commonjs/
function QueryRegistry(ctx) {
    this._ctx = ctx
    // Keep things straight forward and performant by simply hinting
    // at privacy with a leading underscore.
    // this._bar = bar;
    this._registry = {}
    this._routeMap = {}
    this._subscriptions = {}


    // Important: This is the bit of code that is run upon each route change / navigation
    // Making sure that the app is only pulling the data that the user is currently looking at 
    this._ctx.app.router.afterEach((to, from) => {
        console.info('QueryRegistry - changing route: '+from.name +' -> '+to.name)
        this.onRouteChange(from,to)
    })

}

// Define static members directly on the Constructor function.
QueryRegistry.explode = function () {
    throw new Error("KABOOM!");
};  


// Declare instance methods.
QueryRegistry.prototype = Object.create({

    // Place all methods on the prototype so they're shared amongst
    // all instances.  Using `extends` in this fashion ensures that
    // the `constructor` property remains correctly pointed at the
    // `MyClass` function so `instanceof` checks work as expected.

    /**
     * 
     * @param String key - query  name 
     * @param Subscription sub 
     */
    add: function(queryName,observableQuery) {
        // console.info('this._ctx.route',this._ctx.route)
        this._registry[queryName] = observableQuery

        if(typeof this._registry[queryName] != 'undefined' && typeof this._subscriptions[queryName] != 'undefined') {
            this._subscriptions[queryName].unsubscribe()
        }

        if(typeof this._routeMap[this._ctx.route.name] == 'undefined') {
            this._routeMap[this._ctx.route.name] = [];
        }
        this._routeMap[this._ctx.route.name].push(queryName)
        // console.info('this._registry',this._registry)
        // console.info('this._routeMap',this._routeMap)
    },

    addSubscription: function(queryName,subscription) {
        // console.info('this._ctx.route',this._ctx.route)
        this._subscriptions[queryName] = subscription
    },

    onRouteChange: function(from,to) {
        // console.info('route changed',from,to)
        this.stop();
        this.startByRoute(to.name)
    },

    startByRoute: function(currentRouteName) {
        if ( typeof(this._routeMap[currentRouteName]) !== "undefined" && this._routeMap[currentRouteName] !== null ) {
            let queries = this._routeMap[currentRouteName]
            for (var queryName of queries) {
                let observableQuery = this._registry[queryName]
                observableQuery.startPolling(POLL_INTERVAL)
                // console.info('START observableQuery',currentRouteName,queryName,observableQuery)

            }
        }
    },

    stop: function() {
        // console.info('QueryRegistry stopAll');
        for (var queryName in this._registry) {
            let observableQuery = this._registry[queryName]
            observableQuery.stopPolling()
            // console.info('STOP observableQuery',queryName,observableQuery)
        }
    },

    start: function() {
        let currentRouteName = this._ctx.route.name
        this.startByRoute(currentRouteName)
    },

    // greet: function (someone) {
    //   // Make a call to the Parent Class' `greet` method.
    //   var greeting = MyClass.super_.prototype.greet.call(this, someone);
    //   return greeting + ", dude!";
    // },
  
    // Again, just hint at privacy with a leading underscore; doing
    // so ensures you have easy access to `this` in each method.
    // _throbulate: function () {
      // Implementation omitted for brevity.
    // }
});
  
export default QueryRegistry;