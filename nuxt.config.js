// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [
    '~/assets/css/main.css',
    'primeicons/primeicons.css'
  ],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  modules: ['nuxt-pdfmake', "@nuxtjs/i18n", 'nuxt-auth-sanctum'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'development' ? process.env.DEV_API_URL : process.env.PROD_API_URL,
      sanctum: {
        mode: 'token',
        baseUrl: process.env.NODE_ENV === 'development' ? process.env.DEV_API_URL : process.env.PROD_API_URL,
        endpoints: {
          login: '/auth/login',
          logout: '/auth/logout',
          user: '/auth/me',
        },
        redirect: {
          keepRequestedRoute: false,
          onLogin: '/dashboard',
          onLogout: '/auth',
          onAuthOnly: '/auth',
          onGuestOnly: '/',
        },
      },
    },
  },

  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      alwaysRedirect: true
    },
    locales: [
      {
        name: 'Қазақша',
        short_name: 'Қаз',
        code: 'kk',
        iso: 'kk-KK',
        file: 'kk-KK.js',
        flag_img: 'kk.svg'
      },
      {
        name: 'Русский',
        short_name: 'Рус',
        code: 'ru',
        iso: 'ru-RU',
        file: 'ru-RU.js',
        flag_img: 'ru.svg'
      }
    ],
    lazy: true,
    langDir: 'lang/',
    strategy: 'no_prefix',
    defaultLocale: 'ru',
  }
})