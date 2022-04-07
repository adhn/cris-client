import QueryRegistry from '~/classes/QueryRegistry.js'

// https://blog.lichter.io/posts/organize-and-decouple-your-api-calls-in-nuxtjs/

export default (ctx, inject) => {
//   const repositoryWithAxios = createRepository(ctx.$axios)


//   const repositories = {
//     posts: repositoryWithAxios('posts'),
//     users: repositoryWithAxios('users')
//     //...
//   }

    let queryRegistry = new QueryRegistry(ctx);
    inject('queryRegistry', queryRegistry)

}