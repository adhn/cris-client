export default function ({ store, redirect,app }) {
    app.$auth.logout()
    redirect('/')
}

