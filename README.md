# NProgressE

[![npm version](https://img.shields.io/npm/v/nprogresse.svg)](https://www.npmjs.com/package/nprogresse)
[![npm downloads](https://img.shields.io/npm/dm/nprogresse.svg)](https://www.npmjs.com/package/nprogresse)
[![license](https://img.shields.io/npm/l/nprogresse.svg)](https://github.com/AkatQuas/nprogresse/blob/master/LICENSE)

Minimalist top loading progress bar for modern browsers.

Inspired by [nprogress](https://github.com/rstacruz/nprogress) by rstacruz. The trailing `e` distinguishes the package name; the API is largely the same.

## Browser support

v1.0 targets evergreen browsers only (Chrome, Firefox, Safari, Edge — last two major versions). IE11 and legacy vendor-prefix fallbacks are not supported.

See [CHANGELOG](./CHANGELOG.md) for breaking changes from 0.x.

## Installation

```bash
npm install nprogresse
```

## Usage

### ES modules

```js
import NProgressE from 'nprogresse';
import 'nprogresse/style.css';

NProgressE.start();
NProgressE.done();   // success
NProgressE.error();  // error state
```

### Script tag (UMD)

```html
<link rel="stylesheet" href="https://unpkg.com/nprogresse/dist/style.css" />
<script src="https://unpkg.com/nprogresse/dist/index.js"></script>
<script>
  NProgressE.start();
  NProgressE.done();
</script>
```

## API

| Method | Description |
| --- | --- |
| `start()` | Show the bar and begin trickling |
| `done(force?)` | Complete successfully and hide |
| `error(force?)` | Complete with error styling and hide |
| `set(n)` | Set progress to `n` (0–1) |
| `inc(amount?)` | Increment progress |
| `configure(options)` | Update settings |
| `remove()` | Remove the bar from the DOM |

Read-only properties: `status`, `el`, `settings`.

### Configuration

```js
NProgressE.configure({
  minimum: 0.08,        // initial progress (default: 0.08)
  easing: 'linear',     // CSS easing (default: 'linear')
  speed: 200,           // animation duration in ms (default: 200)
  trickle: true,        // auto-increment while active (default: true)
  trickleSpeed: 200,    // trickle interval in ms (default: 200)
  showSpinner: false,   // show corner spinner (default: false)
  parent: 'body',       // container selector (default: 'body')
  template: '...',      // custom HTML; keep `[role="bar"]`
});
```

### Force show on done/error

`done()` and `error()` are no-ops unless the bar was started. Pass `true` to force:

```js
NProgressE.done(true);
NProgressE.error(true);
```

## Customization

Override styles via [src/style.less](./src/style.less) or the built [dist/style.css](./dist/style.css).

The default template requires an element with `role="bar"`. See the [default template](./src/index.ts#L75).

## Development

```bash
npm install
npm test          # run tests
npm run build     # build dist/
npm run examples  # build + serve examples at http://localhost:5173
```

Examples:

- [examples/basic.html](./examples/basic.html)
- [examples/simple.html](./examples/simple.html)

## License

[MIT](./LICENSE)
