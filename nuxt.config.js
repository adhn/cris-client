const nodeExternals = require('webpack-node-externals')
const resolve = (dir) => require('path').join(__dirname, dir)
require('dotenv').config()
module.exports = {
    mode: 'spa',

    srcDir: __dirname,

    env: {
        appUrl: process.env.APP_URL || 'http://localhost:3000',
        apiUrl: process.env.APP_URL+'/graphql' || '/graphql',
        appName: process.env.APP_NAME || '',
    },

    head: {
        title: process.env.APP_NAME,
        titleTemplate: '%s - ' + process.env.APP_NAME,
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'Nuxt.js project'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'}
        ],
        script: [

        ]
    },

    loading: {color: '#007bff'},
    // auth: {
    //     redirect: {
    //         // login: process.env.APP_URL+'/oauth/authorize',
    //         logout: '/logout',
    //         callback: '/callback',
    //         // user: false
    //     },
    //     plugins: [        
    //         '~/plugins/axios',

    //     ],
    //     // strategies: {
    //         // local: {
    //         //     endpoints: {
    //         //         login: { propertyName: 'token.accessToken' }
    //         //     }
    //         // }
    //         // 'laravel.passport': {
    //         //     url: process.env.APP_URL+':8080',
    //         //     client_id: process.env.PASSPORT_ID,
    //         //     client_secret: process.env.PASSPORT_SECRET,
    //         //     response_type: 'code',
    //         // },

    //     // }

    // },

    router: {
        middleware: ['authenticate']
    },

    css: [
        '~assets/sass/app.scss',
        '~assets/stylus/app.styl',
        // 'fullcalendar/dist/fullcalendar.css'

    ],

    plugins: [
        '~/plugins/vuetify',
        '~/plugins/axios',
        '~/plugins/planer',
        '~/plugins/query-registry'
        // { src: '~/plugins/nuxt-client-init.js', ssr: false }
    ],

    modules: [
        // '@nuxtjs/router',
        '~/modules/spa',
        '@nuxtjs/axios',
        // '@nuxtjs/auth',
        '@nuxtjs/apollo',
        ['cookie-universal-nuxt', { alias: 'cookiz' }],
    ],
    axios: {
        // proxyHeaders: false
        baseURL: process.env.APP_URL,
        init(axios, ctx) {
            // axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN'
            // console.info(axios.defaults.xsrfHeaderName)
        }
    },
    apollo: {
        // tokenName: 'yourApolloTokenName', // optional, default: apollo-token
        includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
        // authenticationType: 'Basic', // optional, default: 'Bearer'
        // required
        clientConfigs: {
            default: '~/plugins/graphql-endpoint.js',
        }
    },
    build: {
        extractCSS: true,
        babel: {
            plugins: [
                ["transform-imports", {
                    "vuetify": {
                        "transform": "vuetify/es5/components/${member}",
                        "preventFullImport": true
                    }
                }],
                "graphql-tag"
            ],
        },
        vendor: [
            '~/plugins/vuetify.js',
            // '~/plugins/graphql.js',
            // 'axios',
            // 'lodash'
        ],
        /*
        ** Run ESLint on save
        */
        extend(config, ctx) {
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
            if(ctx.isServer) {
                config.externals = [
                    nodeExternals({
                        whitelist: [/^vuetify/]
                    })
                ]
            }
        }
    }
}

