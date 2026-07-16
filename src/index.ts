import './style.less';

export interface ConfigureOptions {
  minimum?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  speed?: number;
  trickle?: boolean;
  trickleSpeed?: number;
  showSpinner?: boolean;
  parent?: string;
  template?: string;
}

type QueueCallback = (next: () => void) => void;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function toBarPerc(n: number): number {
  return (-1 + n) * 100;
}

const queue = (() => {
  const pending: QueueCallback[] = [];
  const next = () => {
    const fn = pending.shift();
    if (fn) {
      fn(next);
    }
  };
  return (fn: QueueCallback) => {
    pending.push(fn);
    if (pending.length === 1) {
      next();
    }
  };
})();

function setStyles(
  el: HTMLElement,
  properties: Record<string, string | number>
): void {
  for (const [prop, value] of Object.entries(properties)) {
    if (value !== undefined) {
      el.style.setProperty(prop, String(value));
    }
  }
}

function barPositionCSS(
  n: number,
  speed: number,
  ease: string
): Record<string, string> {
  return {
    transition: `all ${speed}ms ${ease}`,
    transform: `translate3d(${toBarPerc(n)}%,0,0)`,
  };
}

class NProgressE {
  static version = __NP_VERSION__;

  settings = {
    minimum: 0.08,
    easing: 'linear' as const,
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

  status: number | null = null;
  el: HTMLElement | null = null;

  configure(options: ConfigureOptions): this {
    Object.assign(this.settings, options);
    return this;
  }

  isStarted(): boolean {
    return typeof this.status === 'number';
  }

  isRendered(): boolean {
    const parent = document.querySelector(this.settings.parent);
    return !!parent?.querySelector('#nprogresse');
  }

  render(fromStart: boolean): HTMLElement {
    if (this.isRendered() && this.el) {
      return this.el;
    }

    const { settings } = this;
    document.documentElement.classList.add('nprogresse-busy');

    const progress = document.createElement('div');
    progress.id = 'nprogresse';
    progress.innerHTML = settings.template;

    const bar = progress.querySelector<HTMLElement>(settings.barSelector);
    const perc = fromStart ? -100 : toBarPerc(this.status ?? 0);
    const parent = document.querySelector<HTMLElement>(settings.parent);

    if (!bar || !parent) {
      throw new Error('NProgressE: invalid bar selector or parent element');
    }

    setStyles(bar, {
      transition: 'all 0 linear',
      transform: `translate3d(${perc}%,0,0)`,
    });

    if (!settings.showSpinner) {
      progress.querySelector(settings.spinnerSelector)?.remove();
    }

    if (parent !== document.body) {
      parent.classList.add('nprogresse-custom-parent');
    }

    parent.appendChild(progress);
    this.el = progress;
    return progress;
  }

  remove(): void {
    const { settings } = this;
    document.documentElement.classList.remove('nprogresse-busy');
    document
      .querySelector(settings.parent)
      ?.classList.remove('nprogresse-custom-parent');
    this.el?.remove();
    this.status = null;
    this.el = null;
  }

  set(n: number): this {
    const started = this.isStarted();
    const { settings } = this;
    n = clamp(n, settings.minimum, 1);
    this.status = n;

    const progress = this.render(!started);
    progress.offsetWidth;

    queue((next) => {
      const { speed, easing, barSelector } = settings;
      const bar = progress.querySelector<HTMLElement>(barSelector);
      if (!bar) {
        next();
        return;
      }

      setStyles(bar, barPositionCSS(n, speed, easing));

      if (n === 1) {
        setStyles(progress, {
          transition: 'none',
          opacity: '1',
        });
        progress.offsetWidth;

        setTimeout(() => {
          setStyles(progress, {
            transition: `all ${speed}ms linear`,
            opacity: '0',
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

  start(): this {
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

  done(force = false): this {
    if (!force && !this.status) {
      return this;
    }
    this.inc(0.3 + 0.5 * Math.random());
    this.el?.classList.remove('error');
    return this.set(1);
  }

  error(force = false): this {
    if (!force && !this.status) {
      return this;
    }
    this.inc(0.3 + 0.5 * Math.random());
    this.el?.classList.add('error');
    return this.set(1);
  }

  inc(amount?: number): this {
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
