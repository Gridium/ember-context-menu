import layout from '../templates/components/context-menu';

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { reads } from '@ember/object/computed';
import { computed, get } from '@ember/object';

export default Component.extend({
  tagName: '',
  layout,

  contextMenu: service('context-menu'),

  isActive: reads('contextMenu.isActive'),
  renderLeft: reads('contextMenu.renderLeft'),
  items: reads('contextMenu.items'),
  _selection: reads('contextMenu.selection'),
  details: reads('contextMenu.details'),
  clickEvent: reads('contextMenu.event'),

  selection: computed('_selection.[]', function () {
    return [].concat(this._selection);
  }),

  didInsertElement() {
    this._super(...arguments);
    this.wormholeElement = this.ensureWormholeElement();
  },

  ensureWormholeElement() {
    let id = 'wormhole-context-menu';
    let target = document.getElementById(id);

    if (!target) {
      document.body.insertAdjacentHTML('beforeend', `<div id="${id}"></div>`);
      target = document.getElementById(id);
    }

    return target;
  },

  position: computed('contextMenu.position.{left,top}', function () {
    let { left, top } = get(this, 'contextMenu.position') || {};
    return htmlSafe(`left: ${left}px; top: ${top}px;`);
  }),

  itemIsDisabled: computed('selection.[]', 'details', function () {
    let selection = this.selection || [];
    let details = this.details;

    return function (item) {
      let disabled = item.disabled;

      if (!item.action && !item.subActions) {
        return true;
      }

      if (typeof disabled === 'function') {
        return disabled(selection, details);
      }

      return disabled;
    };
  }),

  clickAction: computed('clickEvent', 'details', 'selection.[]', function () {
    let selection = this.selection;
    let details = this.details;
    let event = this.clickEvent;

    return function (item) {
      item.action?.(selection, details, event);
    };
  }),
});
