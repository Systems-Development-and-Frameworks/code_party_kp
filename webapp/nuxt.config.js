export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'webapp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'theme_color', content: '#3367D6' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  //storybook
  storybook: {
    // Options
  },

  //pwa
  pwa: {
    manifest: {
      name: 'WebApp code-party-kp',
      short_name: "webapp",
      description: "webapp information",
      lang: 'en',
      useWebmanifestExtension: true,
      theme_color: '#3367D6',
      start_url: '/login',
      background_color: "#3367D6",
      display: "standalone"
    },
    icon: true, // disables the icon module
    workbox: {
      importScripts: [
        'custom-sw.js'
      ],
    }
  },

  //@nuxtjs/apollo
  apollo: {
    //https://github.com/nuxt-community/apollo-module#2--load-nuxtjsapollo-module
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:4000',
      }
    }
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/pwa',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/apollo',
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }

}
