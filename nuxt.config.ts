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
  vite: {
    server: {
      hmr: {
        host: 'localhost',
        port: 8443
      }
    }
  },
  hooks: {
    'pages:extend'(pages) {
      
      pages.push(...[
        {
          name: 'index',
          path: '/',
          file: '~/pages/home.vue'
        },
        {
          name: 'favorites',
          path: '/lista/favoritos',
          file: '~/pages/list/favorites.vue'
        },
        {
          name: 'drafts',
          path: '/lista/borradores',
          file: '~/pages/list/drafts.vue'
        }
      ]);
    }
  },
  runtimeConfig: {
    public: {
      context: 'dev',
      dev: {
        webUrl: 'https://localhost:8443',
        apiUrl: 'https://localhost:8843',
        analyticsUrl: 'https://localhost:8883',
        socketsUrl: 'https://localhost:8888',
        notificationsUrl: 'https://localhost:8889',
        authUrl: 'https://localhost:8890',
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