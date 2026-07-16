import { assert } from 'chai';
import $ from 'jquery';
import NProgressE from '../src/index.ts';

describe('NProgressE', () => {
  let savedSettings;

  beforeEach(() => {
    savedSettings = { ...NProgressE.settings };
  });

  afterEach(() => {
    $('#nprogresse').remove();
    $('html').attr('class', '');
    NProgressE.status = null;
    NProgressE.el = null;
    Object.assign(NProgressE.settings, savedSettings);
  });

  describe('.set()', () => {
    it('.set(0) must render', () => {
      NProgressE.set(0);
      assert.equal($('#nprogresse').length, 1);
      assert.equal($('#nprogresse .bar').length, 1);
      assert.equal($('#nprogresse .peg').length, 1);
      assert.equal($('#nprogresse .spinner').length, 0);
    });

    it('.set(1) should appear and disappear', async () => {
      NProgressE.configure({ speed: 10 });
      NProgressE.set(0).set(1);
      assert.equal($('#nprogresse').length, 1);

      await new Promise((resolve) => setTimeout(resolve, 70));
      assert.equal($('#nprogresse').length, 0);
    });

    it('must respect minimum', () => {
      NProgressE.set(0);
      assert.equal(NProgressE.status, NProgressE.settings.minimum);
    });

    it('must clamp to minimum', () => {
      NProgressE.set(-100);
      assert.equal(NProgressE.status, NProgressE.settings.minimum);
    });

    it('must clamp to maximum', () => {
      NProgressE.set(456);
      assert.equal(NProgressE.status, 1);
    });
  });

  describe('.start()', () => {
    it('must render', () => {
      NProgressE.start();
      assert.equal($('#nprogresse').length, 1);
      assert.equal(NProgressE.el, $('#nprogresse')[0]);
    });

    it('must respect minimum', () => {
      NProgressE.start();
      assert.equal(NProgressE.status, NProgressE.settings.minimum);
    });

    it('must be attached to specified parent', () => {
      const test = $('<div>', { id: 'test' }).appendTo('body');
      NProgressE.configure({ parent: '#test' });
      NProgressE.start();
      assert.isTrue($('#nprogresse').parent().is(test));
      assert.isTrue(
        $(NProgressE.settings.parent).hasClass('nprogresse-custom-parent')
      );
      test.remove();
    });
  });

  describe('.done()', () => {
    it('must not render without start', () => {
      NProgressE.done();
      assert.equal($('#nprogresse').length, 0);
    });

    it('.done(true) must render', () => {
      NProgressE.done(true);
      assert.equal($('#nprogresse').length, 1);
    });
  });

  describe('.error()', () => {
    it('must not render without start', () => {
      NProgressE.error();
      assert.equal($('#nprogresse').length, 0);
    });

    it('.error(true) must render', () => {
      NProgressE.error(true);
      assert.equal($('#nprogresse').length, 1);
      assert.isTrue($(NProgressE.el).hasClass('error'));
    });
  });

  describe('.remove()', () => {
    it('should be removed from the parent', () => {
      NProgressE.set(1);
      NProgressE.remove();

      const parent = $(NProgressE.settings.parent);
      assert.isFalse(parent.hasClass('nprogresse-custom-parent'));
      assert.equal(parent.find('#nprogresse').length, 0);
      assert.equal(NProgressE.status, null);
      assert.equal(NProgressE.el, null);
    });
  });

  describe('.inc()', () => {
    it('should render', () => {
      NProgressE.inc();
      assert.equal($('#nprogresse').length, 1);
    });

    it('should start with minimum', () => {
      NProgressE.inc();
      assert.equal(NProgressE.status, NProgressE.settings.minimum);
    });

    it('should increment', () => {
      NProgressE.start();
      const start = NProgressE.status;

      NProgressE.inc();
      assert.isAbove(NProgressE.status, start);
    });

    it('should never reach 1.0', () => {
      for (let i = 0; i < 100; ++i) {
        NProgressE.inc();
      }
      assert.isBelow(NProgressE.status, 1.0);
    });
  });

  describe('.configure()', () => {
    it('should work', () => {
      NProgressE.configure({ minimum: 0.5 });
      assert.equal(NProgressE.settings.minimum, 0.5);
    });
  });

  describe('.configure(showSpinner)', () => {
    it('should not render spinner by default', () => {
      NProgressE.start();
      assert.equal($('#nprogresse .spinner').length, 0);
    });

    it('should be false by default', () => {
      assert.equal(NProgressE.settings.showSpinner, false);
    });

    it('should show (on true)', () => {
      NProgressE.configure({ showSpinner: true });
      NProgressE.start();
      assert.equal($('#nprogresse .spinner').length, 1);
    });
  });
});
