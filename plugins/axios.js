import axios from 'axios'

export default ({ app, store, redirect }) => {

  if (process.server) {
    return
  }


  // axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


  // Request interceptor
  axios.interceptors.request.use(request => {
    request.baseURL = process.env.appUrl
    return request
  })

  // Response interceptor
  axios.interceptors.response.use(response => response, error => {
    // const { status } = error.response || {}

    // if (status >= 500) {
    //   swal({
    //     type: 'error',
    //     title: app.i18n.t('error_alert_title'),
    //     text: app.i18n.t('error_alert_text'),
    //     reverseButtons: true,
    //     confirmButtonText: app.i18n.t('ok'),
    //     cancelButtonText: app.i18n.t('cancel')
    //   })
    // }

    // if (status === 401 && store.getters['auth/check']) {
    //   swal({
    //     type: 'warning',
    //     title: app.i18n.t('token_expired_alert_title'),
    //     text: app.i18n.t('token_expired_alert_text'),
    //     reverseButtons: true,
    //     confirmButtonText: app.i18n.t('ok'),
    //     cancelButtonText: app.i18n.t('cancel')
    //   }).then(() => {
    //     store.commit('auth/LOGOUT')

    //     redirect({ name: 'login' })
    //   })
    // }

    // return Promise.reject(error)
  })
}
