'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-inline-styles': false,
    // TODO: remove these after glimmer refactor
    'no-action': false,
    'no-curly-component-invocation': false,
    'no-implicit-this': false,
    'no-passed-in-event-handlers': false,
  },
};
