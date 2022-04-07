// export default function (context) {
//     // context.userAgent = context.isServer ? context.req.headers['user-agent'] : navigator.userAgent
//     if(!context.store.getters['csrf']) {
//         if (context.params.csrf) {
//             context.commit('csrf', context.params.csrf)
//         } else {
//             context.store.dispatch('fetchCsrf')
//         }
//     }
// }