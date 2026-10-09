# AuraTune — Frontend Structure

This document describes the current frontend. The application uses React, Vite and Tailwind CSS, with dummy data for its content.

```text
frontend/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── common/
    │   │   ├── Icon.jsx
    │   │   ├── Logo.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── TopBar.jsx
    │   ├── player/
    │   │   └── BottomPlayer.jsx
    │   ├── playlist/
    │   │   ├── CoverArt.jsx
    │   │   └── PlaylistCard.jsx
    │   └── song/
    │       ├── SongRow.jsx
    │       └── SongTable.jsx
    ├── pages/
    │   ├── Auth/
    │   │   └── AuthPage.jsx
    │   ├── Home/
    │   │   └── HomePage.jsx
    │   └── PlaylistDetail/
    │       └── PlaylistDetailPage.jsx
    ├── routes/
    │   └── AppRouter.jsx
    ├── styles/
    │   └── index.css
    └── utils/
        └── mockData.js
```

## Purpose of Each Part

- `index.html`, `vite.config.js`: entry point and Vite configuration.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`: dependencies and pnpm installation configuration.
- `tailwind.config.js`, `postcss.config.js`, `src/styles/index.css`: Tailwind configuration and styles.
- `src/main.jsx`, `src/App.jsx`: React initialization and main layout composition.
- `src/components/`: reusable sidebar, header, player, playlist cards, song tables and song rows.
- `src/pages/`: home page, demo login and playlist details.
- `src/routes/AppRouter.jsx`: navigation between `/`, `/login` and `/playlist/:id`.
- `src/utils/mockData.js`: dummy playlists and songs for the interface.

## Current Scope

The frontend needed for the interface has been created. The backend, APIs, database, real authentication, audio files and Search, ArtistProfile, UserProfile and Admin pages have not been implemented. The `node_modules` directory and operating system files such as `.DS_Store` are excluded from the source files to share.

## Supporting Files Beyond the Initially Listed Names

- `index.html` is the HTML entry point required by Vite.
- `postcss.config.js` connects Tailwind to PostCSS.
- `pnpm-lock.yaml` and `pnpm-workspace.yaml` support dependency installation with pnpm.
- The component, page, route, style and sample data files above provide the implementation inside the predefined frontend directories.
