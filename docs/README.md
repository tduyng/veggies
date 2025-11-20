# Documentation Site

This repository now includes comprehensive VitePress documentation!

## View Documentation

### Development Mode

Run the documentation site locally with hot reload:

```bash
pnpm docs:dev
```

Then open your browser to the local URL shown in the terminal (typically port 5173).

### Build for Production

Build the static documentation site:

```bash
pnpm docs:build
```

Output will be in `docs/.vitepress/dist/`

### Preview Production Build

Preview the production build locally:

```bash
pnpm docs:preview
```

## Documentation Structure

```
docs/
├── .vitepress/
│   └── config.ts           # VitePress configuration
├── guide/
│   ├── what-is-veggies.md
│   ├── why-veggies.md
│   ├── getting-started.md
│   └── extensions-overview.md
├── extensions/
│   ├── http-api.md
│   ├── cli.md
│   ├── file-system.md
│   ├── snapshot.md
│   ├── state.md
│   └── fixtures.md
├── advanced/
│   ├── type-system.md
│   └── matchers.md
├── public/
│   └── veggies-banner.png
└── index.md                # Homepage
```

## Contributing to Docs

1. Edit markdown files in `docs/`
2. Run `pnpm docs:dev` to preview changes
3. Build with `pnpm docs:build` to verify
4. Submit PR with documentation changes

## Features

- ✨ Beautiful, responsive design
- 🔍 Built-in search
- 📱 Mobile-friendly
- 🌙 Dark mode support
- 📝 Markdown with code highlighting
- 🔗 Automatic navigation
- 💪 Type-safe with TypeScript

The documentation covers:

- Complete installation and setup guide
- All 6 extensions with examples
- Type system and matchers
- Real-world use cases
- Best practices and tips
- Troubleshooting guides
