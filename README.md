# 🔒 Crate Unpackers

An idle/incremental browser game built with React + TypeScript + Vite.

## Gameplay

1. **Add Crates** to the decrypt queue (costs $5 each)
2. **Wait** for crates to decrypt over time
3. **Open** crates for randomized loot by rarity (Common → Legendary)
4. **Sell** crates for guaranteed money
5. **Buy Upgrades** to speed up decryption, improve loot luck, increase sell value, and expand your queue

### Rarity Tiers
| Rarity | Color | Base Value |
|--------|-------|-----------|
| Common | Gray | $10 |
| Uncommon | Green | $50 |
| Rare | Blue | $200 |
| Epic | Purple | $800 |
| Legendary | Orange | $3,000 |

## Features
- ⏰ **Offline Progress** — crates keep decrypting while you're away (up to 8 hours)
- 💾 **Autosave** — game saves to localStorage every 30 seconds and on tab close
- 📤 **Export/Import** — save your progress as a JSON file
- 🔄 **Reset** — start fresh with confirmation

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Save System

- **Autosave**: Every 30 seconds to `localStorage`
- **Export**: Downloads a `.json` file you can keep as backup
- **Import**: Load a previously exported `.json` save file
- **Reset**: Wipes all progress and starts from scratch
