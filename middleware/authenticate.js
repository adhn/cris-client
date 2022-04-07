export default async function ({ context,store, app }) {
    if(!store.getters['auth/user']) {
        return Promise.all([
            store.dispatch('auth/fetchAuthenticatedUser')
        ])
    }
}