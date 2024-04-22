export default defineNuxtConfig({
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
      }
    }
  }
})