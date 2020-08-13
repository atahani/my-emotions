# Types of My Emotions

This package created to contain all of the common types between the Backend and the Clients in the Monorepo approach.

## How to add it as a local dependency

```
npx lerna add @my-emotions/types packages/backend
```

> NOTE: To have new changes should build the package!

## Build

-   On the `packages/types` path

```
yarn run build
```

-   Globally by Lerna.

```
lerna run --scope @my-emotions/types build
```
