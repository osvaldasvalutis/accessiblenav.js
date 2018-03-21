# accessibleNav.js

A tiny JavaScript plugin for accessible multi-level dropdown menus

## Usage

### Including script

#### Webpack environment

```js
import accessibleNav from 'accessiblenav.js'
```

#### Old-school way

```html
<script src="dist/main.js"></script>
```

### Initiating plugin

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
2. `$ yarn start` or `$ yarn start-prod`
3. Edit plugin at `/src/index.js`, edit demo(s) at `/demo`
4. Build with `$ yarn build` when done
