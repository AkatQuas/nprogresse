NProgressE
=========

See the original [nprogress](https://github.com/rstacruz/nprogress) written by rstacruz, without whom this project wouldn't exist.

The last letter `e` is used for package name distinction, while the usages remains almost the same, see the following.

> Minimalist progress bar

Slim progress bars for Ajax'y applications. Inspired by Google, YouTube, and
Medium.

Installation
------------

Add the files [js](./index.js) and [style](./style.css) to your project.

```html
<script src='nprogresse/index.js'></script>
<link rel='stylesheet' href='nprogresse/style.css'/>
```

This NProgresse is only available via npm in git protocal.

~~~ bash
$ npm install --save nprogresse
# or
$ yarn add nprogresse
~~~

Basic usage
-----------

Simply call `start()`, `done()` and `error()` to control the progress bar.

~~~ js
import NProgresse from 'nprogresse';
import 'nprogresse/style.css';
// start the progress
NProgresse.start();

// finish the progress in good status
NProgresse.done();

// finish the progress in error status
NProgresse.error();
~~~

~~~ js
$(document).on('ajax:start', function() { NProgresse.start(); });
$(document).on('ajax:end',   function() {
  if ('ajax:success') {
    NProgresse.done();
  } else {
    NProgresse.error();
  }
});
~~~

Ideas
-----

* Add progress to your Ajax calls! Bind it to the jQuery `ajaxStart` and `ajaxStop` events.

  - `done()` for `ajaxSuccesss`.

  - `error()` for `ajaxError`.

* Make a fancy loading bar even without Turbolinks/Pjax! Bind it to `$(document).ready` and `$(window).load`.

Advanced usage
--------------

__Percentages:__ To set a progress percentage, call `.set(n)`, where *n* is a
number between `0..1`.

~~~ js
NProgresse.set(0.0);     // Sorta same as .start()
NProgresse.set(0.4);
NProgresse.set(1.0);     // Sorta same as .done()
~~~

__Incrementing:__ To increment the progress bar, just use `.inc()`. This
increments it with a random amount. This will never get to 100%: use it for
every image load (or similar).

~~~ js
NProgresse.inc();
~~~

If you want to increment by a specific value, you can pass that as a parameter:

~~~ js
NProgresse.inc(0.2);    // This will get the current status value and adds 0.2 until status is 0.994
~~~

__Force-done:__ By passing `true` to `done()`, it will show the progress bar
even if it's not being shown. (The default behavior is that *.done()* will not
    do anything if *.start()* isn't called)

~~~ js
NProgresse.done(true);
~~~

__Force-error:__ By passing `true` to `error()`, it will show the progress bar
even if it's not being shown.

~~~ js
NProgresse.error(true);
~~~

__Get the status value:__ To get the status value, use `.status`

~~~ js
console.log(NProgresse.status);
~~~

__Get the progress element:__ To get the element, use `.el`;

~~~ js
console.log(NProgresse.el);
~~~

Configuration
-------------

#### `minimum`
Changes the minimum percentage used upon starting. (default: `0.08`)

~~~ js
NProgresse.configure({ minimum: 0.1 });
~~~

#### `template`
You can change the markup using `template`. To keep the progress
bar working, keep an element with `role='bar'` in there. See the [default template]
for reference.

~~~ js
NProgresse.configure({
  template: "<div class='....'>...</div>"
});
~~~

#### `easing` and `speed`
Adjust animation settings using *easing* (a CSS easing string)
and *speed* (in ms). (default: `ease` and `200`)

~~~ js
NProgresse.configure({ easing: 'ease', speed: 500 });
~~~

#### `trickle`
Turn off the automatic incrementing behavior by setting this to `false`. (default: `true`)

~~~ js
NProgresse.configure({ trickle: false });
~~~

#### `trickleSpeed`
Adjust how often to trickle/increment, in ms.

~~~ js
NProgresse.configure({ trickleSpeed: 200 });
~~~

#### `showSpinner`
Turn on loading spinner by setting it to true. (default: `false`)

~~~ js
NProgresse.configure({ showSpinner: true });
~~~

#### `parent`
specify this to change the parent container. (default: `body`)

~~~ js
NProgresse.configure({ parent: '#container' });
~~~

Customization
-------------

Modify the built [style.css](./style.css) to your liking.

> Tip: you probably only want to find source less file [here](./src/style.less).

The included CSS file is pretty minimal... in fact, feel free to scrap it and
make your own!
