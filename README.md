# Dobble

A simple dobble game to play with friends. <https://dobble-game.surge.sh>

Code is a mess but it is good enough. Stack: firebase + svelte.

## Host a copy

Copy "env.example.ts" to "env.ts" and paste your firebase config there.

Install dependencies:

```sh
yarn
```

Change surge.sh domain in "package.json#scripts.deploy" script and run:

```sh
yarn build
yarn deploy
```
