# Card RPG – Playtest Table

A touch-table prototype of a story card RPG (Film Noir and Space Opera card sets), with a
gameplay simulator to play against bots and to test rule changes.

## Running it

It's plain HTML and JavaScript, with no build step. Serve the folder and open it in a browser:

```
python -m http.server 5173
```

Then go to http://localhost:5173.

## What's where

- `index.html`: the table.
- `rules.js`: the rule values and switches (`SIM_RULES`, per-player-count tuning, game length).
- `deal.js`: dealing and laying out the table (cards, Board, character sheets).
- `sim.js`: the gameplay simulator (bots, the human player's choices, the rules as played).
- `table.js`: dragging, flipping and moving pieces.
- `data.js`, `noir-*.js`, `space-opera.js`: the card content.
- `manual.html` (+ `manual-img/`): a rulebook (out of date with the latest rules).
- `tools/export_data.py`: exports card data from the setup spreadsheet.
