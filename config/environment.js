/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-dropbox-example',
    environment: environment,
    firebase: 'http://ember-dropbox-test.firebaseio.com/',
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' api.dropbox.com ember-dropbox-test.firebaseio.com https://s-dal5-nss-30.firebaseio.com/",
      'font-src': "'self' data: use.typekit.net",
      'connect-src': "'self' localhost:* api.dropbox.com s-dal5-nss-30.firebaseio.com wss://s-dal5-nss-30.firebaseio.com/ https://content.dropboxapi.com",
      'img-src': "'self' www.facebook.com p.typekit.net *.gravatar.com data: localhost:*",
      'style-src': "'self' 'unsafe-inline' use.typekit.net",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com https://s-dal5-nss-30.firebaseio.com/"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
