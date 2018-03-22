# accessibleNav.js

A tiny JavaScript plugin for accessible multi-level dropdown menus

## Usage

### Install

Available as NPM package:

```$ yarn add accessiblenav.js```

### Include

#### Webpack environment

```js
import accessibleNav from 'accessiblenav.js'
```

#### Old-school way

```html
<script src="dist/index.min.js"></script>
```

### Initiate

```js
const nav = document.querySelector('.nav')

accessibleNav(nav, {
  selSub: 'ul',
  selItem: 'li',
  selButton: 'a',
  classItemActive: '--active',
  enableClicks: true,
})
```

## Development

1. `$ yarn`
2. `$ yarn dev`
3. Edit plugin at `/src/index.js`, edit demo(s) at `/demo`
4. Build with `$ yarn build` when done
