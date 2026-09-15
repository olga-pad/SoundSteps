# SoundSteps

SoundSteps is a small, mobile-friendly reading practice app for young children.

## Features

- Russian, English, and French word banks
- Three-, four-, and five-letter reading levels
- A five-word adaptive practice set
- Parent assessment and reading history stored on the device
- A sound-matching activity
- Browser speech synthesis for letter sounds

## Run locally

The project is a static website with no build step. Serve the repository directory with any local HTTP server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Data and privacy

Progress, custom words, language, and reading history are stored only in the browser's `localStorage`. The app has no account system, backend, API keys, or authentication tokens.

Microphone access is not used in this version. Browser speech synthesis is used for most letter sounds.

## Project structure

- `index.html` — interface and responsive styles
- `app.js` — word rotation, parent mode, progress, and sound activity
- `fonts/` — handwriting font and its license
