import dotenv from 'dotenv'

dotenv.config()

export default defineNuxtConfig({
  app: {
    head: {
      title: 'DogsHome',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/DogsHomeLogo-ReDesign (Colorified&Final).png' }
      ]
    }
  },
  
  devtools: { enabled: true },

  devServer: {
    port: 8443
  },

  modules: ["@nuxtjs/tailwindcss", 'nuxt-icon', ['@nuxtjs/google-fonts', {
    families: {
        Lato: {
            wght: [100, 300, 400, 700, 900],
        },
    },
    display: 'swap',
    subsets: 'latin',
    prefetch: false,
    preconnect: false,
    preload: false,
    download: true,
    base64: false
  }], '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  plugins: [
    {src: '~/plugins/firebase.client.ts', mode: 'client'},
  ],
  hooks: {
    'pages:extend'(pages) {
      
      pages.push(...[
        {
          name: 'index',
          path: '/',
          file: '~/pages/home.vue'
        },
        {
          name: 'favoritos',
          path: '/perfil/lista/favoritos',
          file: '~/pages/profile/list/favorites.vue'
        },
        {
          name: 'borradores',
          path: '/perfil/lista/borradores',
          file: '~/pages/profile/list/drafts.vue'
        },
        {
          name: 'perfil-id',
          path: '/perfil/:id',
          file: '~/pages/profile/[id].vue'
        },
        {
          name: 'mi-perfil',
          path: '/perfil',
          file: '~/pages/profile.vue'
        },
        {
          name: 'publicacion-id',
          path: '/publicacion/:id',
          file: '~/pages/publication/[id].vue'
        }
      ]);
    }
  },
  runtimeConfig: {
    public: {
      context: 'prod',
      dev: {
        webUrl: 'https://localhost:8443',
        apiUrl: 'https://api.dogshome.com.ar',
        analyticsUrl: 'https://localhost:8883',
        socketsUrl: 'https://localhost:8888',
        notificationsUrl: 'https://localhost:8889',
        authUrl: 'https://auth.dogshome.com.ar',
      },
      prod: {
        webUrl: 'https://dogshome.com.ar',
        apiUrl: 'https://api.dogshome.com.ar',
        analyticsUrl: 'https://analytics.dogshome.com.ar',
        socketsUrl: 'https://sockets.dogshome.com.ar',
        notificationsUrl: 'https://notifications.dogshome.com.ar',
        authUrl: 'https://auth.dogshome.com.ar',
      }
    }
  }
})