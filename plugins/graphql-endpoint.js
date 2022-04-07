// import { ApolloClient } from 'apollo-client';
import { HttpLink,createHttpLink } from 'apollo-link-http';
// import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';



export default function(context){
    
    const cache = new InMemoryCache({
        dataIdFromObject: object => {
          switch (object.__typename) {
            case 'Project': {
                if(object.project_role_id) return object.__typename+':'+object.id+':'+object.project_role_id+':'+object.deleted_at
                return object.__typename+':'+object.id+':'+object.deleted_at
                // return `bar:${object.blah}`; // use `bar` prefix and `blah` as the primary key
            } 
            case 'Company': {
                if(object.project_role_id) return object.__typename+':'+object.id+'-'+object.project_role_id+':'+object.deleted_at
                return object.__typename+':'+object.id+':'+object.deleted_at
                // return `bar:${object.blah}`; // use `bar` prefix and `blah` as the primary key
            } 
            default: return defaultDataIdFromObject(object); // fall back to default handling
          }
        }
      });





    let cookies = context.app.$cookiz.getAll()
        // console.info(cookies);
        // let csrf = context.store.getters['csrf']


        const httpLink = createHttpLink({
            uri: process.env.apiUrl,
            credentials: 'same-origin',
            //   fetchOptions: {
            //       method: 'POST',
            //       // mode: 'no-cors',
            //   },
        });

        // const authLink = setContext((_, { headers }) => ({
        //     headers: {
        //         ...headers,
        //         'X-CSRF-TOKEN': context.app.$cookiz.get('XSRF-TOKEN'),
        //         'X-XSRF-TOKEN': context.app.$cookiz.get('XSRF-TOKEN'),
        //         'X-Requested-With': 'XMLHttpRequest',
        //         'authorization': 'shit'
        //       },
        // }))

        const authLink = setContext((_, { headers }) => {
            // delete headers.authorization;
            return {
                headers: {
                    ...headers,
                    // 'X-CSRF-TOKEN': context.app.$cookiz.get('XSRF-TOKEN'),
                    'X-XSRF-TOKEN': context.app.$cookiz.get('XSRF-TOKEN'),
                    'X-Requested-With': 'XMLHttpRequest',

                  },
            }
        });

        return {
            cache,
            link: authLink.concat(httpLink),
            getAuth: () => 'Bearer '+ context.store.getters['auth/accessToken']
        }
        // const authLink = setContext((_, {headers}) => {
        //     // get the authentication token from local storage if it exists
        //     // const token = localStorage.getItem('token');
        //     // let token = document.head.querySelector('meta[name="csrf-token"]');
        //     // // return the headers to the context so httpLink can read them]
            

        //     headers = {
        //         ...headers,
        //             // authorization: context.app.$auth.getToken('laravel.passport') ? `${context.app.$auth.getToken('laravel.passport')}` : "",
        //         'X-CSRF-TOKEN': cookies['XSRF-TOKEN'],
        //         'X-Requested-With': 'XMLHttpRequest',
        //     }

        //     // if(cookies['laravel_token']) {
        //     //     returnHeaders['Authorization']  = 'Bearer ' + cookies['laravel_token']
        //     // }
        //     // returnHeaders['Authorization']  = 'Bearer ' + cookies['XSRF-TOKEN']

        //     return headers;
        // });

        // return {
        //     link: authLink.concat(httpLink),
        //     // getAuth: () => 'Bearer '+ context.app.$cookiz.get('laravel_token')
        // }
}