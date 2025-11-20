import { defineConfig } from 'vitepress'
import pkg from '../../package.json'

export default defineConfig({
  title: 'Veggies',
  description: 'Supercharge your Cucumber tests with powerful API, CLI, and snapshot testing extensions',
  base: '/veggies/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/veggies/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/veggies/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '192x192', href: '/veggies/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Veggies | Cucumber Testing Superpowers' }],
    ['meta', { property: 'og:description', content: 'Supercharge your Cucumber tests with powerful API, CLI, and snapshot testing extensions' }],
    ['meta', { property: 'og:image', content: 'https://tduyng.github.io/veggies/veggies-banner.png' }],
  ],

  themeConfig: {
    logo: '/veggies-logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Extensions', link: '/extensions/http-api' },
      { text: 'Advanced', link: '/advanced/type-system' },
      {
        text: `v${pkg.version}`,
        items: [
          { text: 'Changelog', link: 'https://github.com/ekino/veggies/blob/master/CHANGELOG.md' },
          { text: 'Contributing', link: 'https://github.com/ekino/veggies/blob/master/CONTRIBUTING.md' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Extensions Overview', link: '/guide/extensions-overview' },
          ]
        }
      ],
      '/extensions/': [
        {
          text: 'Extensions',
          items: [
            { text: 'HTTP API Testing', link: '/extensions/http-api' },
            { text: 'CLI Testing', link: '/extensions/cli' },
            { text: 'File System', link: '/extensions/file-system' },
            { text: 'Snapshot Testing', link: '/extensions/snapshot' },
            { text: 'State', link: '/extensions/state' },
            { text: 'Fixtures', link: '/extensions/fixtures' },
          ]
        }
      ],
      '/advanced/': [
        {
          text: 'Advanced Features',
          items: [
            { text: 'Type System', link: '/advanced/type-system' },
            { text: 'Matchers', link: '/advanced/matchers' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ekino/veggies' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@ekino/veggies' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2017-present Ekino'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/ekino/veggies/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})
