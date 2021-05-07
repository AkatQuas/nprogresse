(function () {
  var root = this;
  var assert = (root.chai || require('chai')).assert;

  describe('NProgressE', function () {
    var $, NProgressE;

    beforeEach(function () {
      $ = root.jQuery || require('jquery');
      NProgressE = root.NProgressE || require('../index');

      this.settings = $.extend({}, NProgressE.settings);
    });

    afterEach(function () {
      $('#nprogresse').remove();
      $('html').attr('class', '');
      NProgressE.status = null;

      // Restore settings
      $.extend(NProgressE.settings, this.settings);
    });

    describe('.set()', function () {
      it('.set(0) must render', function (done) {
        NProgressE.set(0);
        assert.equal($('#nprogresse').length, 1);
        assert.equal($('#nprogresse .bar').length, 1);
        assert.equal($('#nprogresse .peg').length, 1);
        assert.equal($('#nprogresse .spinner').length, 0);

        done();
      });

      it('.set(1) should appear and disappear', function (done) {
        NProgressE.configure({ speed: 10 });
        NProgressE.set(0).set(1);
        assert.equal($('#nprogresse').length, 1);

        setTimeout(function () {
          assert.equal($('#nprogresse').length, 0);
          done();
        }, 70);
      });

      it('must respect minimum', function () {
        NProgressE.set(0);
        assert.equal(NProgressE.status, NProgressE.settings.minimum);
      });

      it('must clamp to minimum', function () {
        NProgressE.set(-100);
        assert.equal(NProgressE.status, NProgressE.settings.minimum);
      });

      it('must clamp to maximum', function () {
        NProgressE.set(456);
        assert.equal(NProgressE.status, 1);
      });
    });

    // ----

    describe('.start()', function () {
      it('must render', function (done) {
        NProgressE.start();
        assert.equal($('#nprogresse').length, 1);
        assert.equal(NProgressE.el, $('#nprogresse')[0]);
        done();
      });

      it('must respect minimum', function () {
        NProgressE.start();
        assert.equal(NProgressE.status, NProgressE.settings.minimum);
      });

      it('must be attached to specified parent', function () {
        var test = $('<div>', { id: 'test' }).appendTo('body');
        NProgressE.configure({ parent: '#test' });
        NProgressE.start();
        assert.isTrue($('#nprogresse').parent().is(test));
        assert.isTrue(
          $(NProgressE.settings.parent).hasClass('nprogresse-custom-parent')
        );
      });
    });

    // ----

    describe('.done()', function () {
      it('must not render without start', function (done) {
        NProgressE.done();
        assert.equal($('#nprogresse').length, 0);
        done();
      });

      it('.done(true) must render', function (done) {
        NProgressE.done(true);
        assert.equal($('#nprogresse').length, 1);
        done();
      });
    });

    describe('.error()', function () {
      it('must not render without start', function (done) {
        NProgressE.error();
        assert.equal($('#nprogresse').length, 0);
        done();
      });

      it('.error(true) must render', function (done) {
        NProgressE.error(true);
        assert.equal($('#nprogresse').length, 1);
        assert.isTrue($(NProgressE.el).hasClass('error'));
        done();
      });
    });
    // ----

    describe('.remove()', function () {
      it('should be removed from the parent', function () {
        NProgressE.set(1);
        NProgressE.remove();

        var parent = $(NProgressE.settings.parent);
        assert.isFalse(parent.hasClass('nprogress-custom-parent'));
        assert.equal(parent.find('#nprogresse').length, 0);
        assert.equal(NProgressE.status, null);
        assert.equal(NProgressE.el, null);
      });
    });

    // ----

    describe('.inc()', function () {
      it('should render', function () {
        NProgressE.inc();
        assert.equal($('#nprogresse').length, 1);
      });

      it('should start with minimum', function () {
        NProgressE.inc();
        assert.equal(NProgressE.status, NProgressE.settings.minimum);
      });

      it('should increment', function () {
        NProgressE.start();
        var start = NProgressE.status;

        NProgressE.inc();
        assert.operator(NProgressE.status, '>', start);
      });

      it('should never reach 1.0', function () {
        for (var i = 0; i < 100; ++i) {
          NProgressE.inc();
        }
        assert.operator(NProgressE.status, '<', 1.0);
      });
    });

    // -----

    describe('.configure()', function () {
      it('should work', function () {
        NProgressE.configure({ minimum: 0.5 });
        assert.equal(NProgressE.settings.minimum, 0.5);
      });
    });

    // ----

    describe('.configure(showSpinner)', function () {
      it('should not render spinner by default', function () {
        NProgressE.start();

        assert.equal($('#nprogresse .spinner').length, 0);
      });

      it('should be true by default', function () {
        assert.equal(NProgressE.settings.showSpinner, false);
      });

      it('should show (on true)', function () {
        NProgressE.configure({ showSpinner: true });
        NProgressE.start();

        assert.equal($('#nprogresse .spinner').length, 1);
      });
    });
  });
})();
