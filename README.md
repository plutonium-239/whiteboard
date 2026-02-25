# Whiteboard

A drawing application where you can reflect your thoughts. It helps you convey your ideas in a more colorful and vivid way using shapes, icons, and emojis.

## About

Whiteboard lets you visualize ideas instead of writing plain text. You can use shapes, icons, and emojis in a simple but effective way. All data is stored locally in your browser — no server or account needed.

> **Note:** Because storage is browser-local, drawings are not shared between devices or browsers. Clearing your browser's localStorage will delete your projects.

## Setup

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
whiteboard/
├── src/            # React source code
│   ├── components/ # UI components (editor, project manager, etc.)
│   ├── libs/       # Storage helpers (localStorage)
│   └── shapes/     # Custom tldraw shapes
├── public/         # Static assets (fonts, emojis)
├── index.html
└── vite.config.js
```

## Storage

Projects and drawings are persisted in `localStorage` under these keys:

| Key | Contents |
|-----|----------|
| `whiteboard:projects` | Array of project metadata (id, name) |
| `whiteboard:snapshot:{id}` | tldraw snapshot for a project |

Images added to the canvas are converted to data URIs and stored inline — no external file storage is used.

## Known limitations

- Projects and pages cannot be deleted yet.
- Resources (icons, fonts) may load slowly on first visit.
- Project names are auto-generated; renaming is not yet supported.
