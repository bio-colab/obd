# OBD-II Smart Diagnostics

A modern, web-based OBD-II diagnostic tool built with React, TypeScript, and Vite. It connects to ELM327 adapters via USB, Bluetooth (BLE), or WiFi to read real-time vehicle data, diagnose fault codes (DTCs), and provide AI-powered repair recommendations.

## Features
- **Multi-Protocol Connection:** Supports USB (Serial), Bluetooth Low Energy (BLE), and WiFi ELM327 adapters.
- **Real-time Dashboard:** Live monitoring of RPM, Speed, Engine Load, Coolant Temp, and more.
- **Smart Diagnostics:** Reads and clears DTCs, with a built-in database for generic and manufacturer-specific codes.
- **AI Analysis:** Uses Gemini AI to analyze fault codes and live data to suggest root causes and repair steps.
- **Driver Behavior Scoring:** Analyzes acceleration and braking patterns to score driving habits.
- **Offline Support:** Uses Dexie.js to store session data locally and queues IoT payloads when offline.

## Architecture
- **Connection Layer:** Abstract `ConnectionManager` with concrete implementations (`usb.ts`, `ble.ts`, `wifi.ts`, `demo.ts`).
- **Protocol Layer:** `ELM327` class handles AT commands, PID parsing, and hex decoding.
- **State Management:** Zustand store divided into logical slices (`connectionSlice`, `pollingSlice`, `diagnosticSlice`, `settingsSlice`).
- **Local Database:** Dexie.js (IndexedDB) for storing readings, events, and sessions.
- **Backend:** Express server (`server.ts`) acts as an IoT endpoint and AI proxy.

## Setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add your `GEMINI_API_KEY`.
3. Start the development server: `npm run dev`

## Testing
Run tests using Vitest:
`npm run test`
