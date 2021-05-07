import './style.less';

export interface configureOptions {
  minimum?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  positionUsing?: string;
  speed?: number;
  showSpinner?: boolean;
  parent?: string;
  template?: string;
}

function clamp(n: number, min: number, max: number): number {
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
}

/**
 * (Internal) converts a percentage (`0..1`) to a bar translateX
 * percentage (`-100%..0%`).
 */
function toBarPerc(n: number): number {
  return (-1 + n) * 100;
}

/**
 * (Internal) Queues a function to be executed.
 */
const queue = (() => {
  const pending: Array<Function> = [];
  const next = () => {
    const fn = pending.shift();
    if (fn) {
      fn(next);
    }
  };
  return (fn: Function) => {
    pending.push(fn);
    if (pending.length === 1) {
      next();
    }
  };
})();

/**
 * Determine which positioning CSS rule to use.
 */
const getPositioningCSS = (): string => {
  // Sniff on document.body.style
  const bodyStyle = document.body.style;

  // Sniff prefixes
  const vendorPrefix =
    'WebkitTransform' in bodyStyle
      ? 'Webkit'
      : 'MozTransform' in bodyStyle
      ? 'Moz'
      : 'msTransform' in bodyStyle
      ? 'ms'
      : 'OTransform' in bodyStyle
      ? 'O'
      : '';

  if (vendorPrefix + 'Perspective' in bodyStyle) {
    // Modern browsers with 3D support, e.g. Webkit, IE10
    return 'translate3d';
  } else if (vendorPrefix + 'Transform' in bodyStyle) {
    // Browsers without 3D support, e.g. IE9
    return 'translate';
  } else {
    // Browsers without translate() support, e.g. IE7-8
    return 'margin';
  }
};
/**
 * (Internal) Gets a space separated list of the class names on the element.
 * The list is wrapped with a single space on each end to facilitate finding
 * matches within the list.
 */
function classList(element: Element): string {
  return (' ' + ((element && element.className) || '') + ' ').replace(
    /\s+/gi,
    ' '
  );
}

/**
 * (Internal) Determines if an element or space separated list of class names contains a class name.
 */
function hasClass(element: Element | string, name: string): boolean {
  var list = typeof element == 'string' ? element : classList(element);
  return list.indexOf(' ' + name + ' ') >= 0;
}

/**
 * (Internal) Adds a class to an element.
 */
function addClass(element: Element, name: string): void {
  const oldList = classList(element);
  const newList = oldList + name;

  if (hasClass(oldList, name)) return;

  // Trim the opening space.
  element.className = newList.substring(1);
}

/**
 * (Internal) Removes a class from an element.
 */
function removeClass(element: HTMLElement, name: string): void {
  const oldList = classList(element);

  if (!hasClass(element, name)) return;

  // Replace the class name.
  const newList = oldList.replace(' ' + name + ' ', ' ');

  // Trim the opening and closing spaces.
  element.className = newList.substring(1, newList.length - 1);
}

/**
 * (Internal) Removes an element from the DOM.
 */
function removeElement(element: Element): void {
  element && element.parentNode && element.parentNode.removeChild(element);
}

/**
 * (Internal) Applies css properties to an element, similar to the jQuery
 * css method.
 *
 * While this helper does assist with vendor prefixed property names, it
 * does not perform any manipulation of values prior to setting styles.
 */
const css = (function () {
  const cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'];
  const cssProps = {};
  const camelCase = (str: string): string =>
    str
      .replace(/^-ms-/, 'ms-')
      .replace(/-([\da-z])/gi, (match, letter) => letter.toUpperCase());

  const getVendorProp = (name: string): string => {
    const style = document.body.style;
    if (name in style) return name;

    let i = cssPrefixes.length;
    const capName = name.charAt(0).toUpperCase() + name.slice(1);
    let vendorName: string = '';
    while (i--) {
      vendorName = cssPrefixes[i] + capName;
      if (vendorName in style) return vendorName;
    }

    return name;
  };

  const getStyleProp = (name: string): string => {
    const ccname = camelCase(name);
    return cssProps[ccname] || (cssProps[ccname] = getVendorProp(ccname));
  };

  const applyCss = (
    el: HTMLElement | Element,
    prop: string,
    value: any
  ): void => {
    const styleProp = getStyleProp(prop);
    el['style'][styleProp] = value;
  };

  return function (el: Element, properties: any) {
    const args = arguments;

    if (args.length == 2) {
      for (const prop in properties) {
        const value = properties[prop];
        if (value !== undefined && properties.hasOwnProperty(prop))
          applyCss(el, prop, value);
      }
    } else {
      applyCss(el, args[1], args[2]);
    }
  };
})();

/**
 * Returns the correct CSS for changing the bar's
 * position given an n percentage, and speed and ease from Settings
 */
function barPositionCSS(
  positionUsing: string,
  n: number,
  speed: number,
  ease: string
) {
  const barCSS: {
    transition: string;
    transform?: string;
    'margin-left'?: string;
  } = {
    transition: 'all ' + speed + 'ms ' + ease,
  };
  switch (positionUsing) {
    case 'translate3d':
      barCSS.transform = 'translate3d(' + toBarPerc(n) + '%,0,0)';
      break;
    case 'translate':
      barCSS.transform = 'translate(' + toBarPerc(n) + '%,0)';
      break;
    default:
      barCSS['margin-left'] = toBarPerc(n) + '%';
      break;
  }
  return barCSS;
}

class NProgressE {
  static version = '0.2.2';
  settings = {
    minimum: 0.08,
    easing: 'linear',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleSpeed: 200,
    showSpinner: false,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template:
      '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
  };
  status: number = null;
  el: HTMLElement = null;

  /**
   * Configure the settings.
   *
   *     NProgressE.configure({
   *       minimum: 0.1,
   *        ...
   *     });
   */
  configure(options: configureOptions): NProgressE {
    for (const key in options) {
      const value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) {
        this.settings[key] = value;
      }
    }
    return this;
  }

  /**
   * Check if the progress started
   */
  isStarted(): boolean {
    return typeof this.status === 'number';
  }

  /**
   * Check if the progress rendered in DOM
   */
  isRendered(): boolean {
    return !!document.querySelector('#nprogresse');
  }

  /**
   * Render the progress bar markup based on the `template` in the setting.
   * @param fromStart start status
   */
  render(fromStart: boolean): HTMLElement {
    if (this.isRendered()) {
      return this.el;
    }
    const { settings } = this;
    addClass(document.documentElement, 'nprogresse-busy');
    const progress = document.createElement('div');
    progress.id = 'nprogresse';
    progress.innerHTML = settings.template;

    const bar = progress.querySelector(settings.barSelector);
    const perc = fromStart ? -100 : toBarPerc(this.status || 0);
    const parent = document.querySelector(settings.parent);

    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)',
    });

    if (!settings.showSpinner) {
      const spinner = progress.querySelector(settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'nprogresse-custom-parent');
    }

    parent.appendChild(progress);
    this.el = progress;
    return progress;
  }

  /**
   * Removes the element. Opposite of render().
   */
  remove(): void {
    const { settings } = this;
    removeClass(document.documentElement, 'nprogresse-busy');
    removeClass(
      document.querySelector(settings.parent),
      'nprogresse-custom-parent'
    );
    const progress = this.el;
    progress && removeElement(progress);
    this.status = null;
    this.el = null;
  }

  /**
   * Sets the progress bar status.
   *
   *    NProgressE.set(0.4);
   *    NProgressE.set(1.0);
   * @param n number between 0 and 1
   */
  set(n: number): NProgressE {
    const started = this.isStarted();
    const { settings } = this;
    n = clamp(n, settings.minimum, 1);
    this.status = n;
    const progress = this.render(!started);
    progress.offsetWidth; /* Repaint */

    queue((next: Function) => {
      const { speed, easing, barSelector, positionUsing } = settings;
      const bar = progress.querySelector(barSelector);
      if (positionUsing === '') {
        this.settings.positionUsing = getPositioningCSS();
      }
      css(bar, barPositionCSS(this.settings.positionUsing, n, speed, easing));

      if (n === 1) {
        css(progress, {
          transition: 'none',
          opacity: 1,
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(() => {
          css(progress, {
            transition: 'all ' + speed + 'ms linear',
            opacity: 0,
          });
          setTimeout(() => {
            this.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  }

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     NProgressE.start();
   *
   */
  start(): NProgressE {
    if (!this.status) {
      this.set(0);
    }
    const { settings } = this;
    const work = () => {
      setTimeout(() => {
        if (!this.status) {
          return;
        }
        this.inc();
        work();
      }, settings.trickleSpeed);
    };

    if (settings.trickle) {
      work();
    }
    return this;
  }

  /**
   * Hides the progress bar in good way.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `done()` makes some placebo effect of some realistic motion.
   *
   *     NProgressE.done();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgressE.done(true);
   */
  done(force: boolean): NProgressE {
    if (!force && !this.status) return this;
    this.inc(0.3 + 0.5 * Math.random());
    removeClass(this.el, 'error');
    return this.set(1);
  }

  /**
   * Hides the progress bar in error way.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `error()` makes some placebo effect of some realistic motion.
   *
   *     NProgressE.error();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgressE.error(true);
   */
  error(force: boolean): NProgressE {
    if (!force && !this.status) return this;
    this.inc(0.3 + 0.5 * Math.random());
    addClass(this.el, 'error');
    return this.set(1);
  }

  /**
   * Increments by a random amount.
   */
  inc(amount?: number): NProgressE {
    let n = this.status;
    if (!n) {
      return this.start();
    }
    if (n > 1) {
      return this;
    }
    if (typeof amount !== 'number') {
      if (n >= 0 && n < 0.2) {
        amount = 0.1;
      } else if (n >= 0.2 && n < 0.5) {
        amount = 0.04;
      } else if (n >= 0.5 && n < 0.8) {
        amount = 0.02;
      } else if (n >= 0.8 && n < 0.99) {
        amount = 0.005;
      } else {
        amount = 0;
      }
    }
    n = clamp(n + amount, 0, 0.994);
    return this.set(n);
  }
}

export default new NProgressE();
