import { popupAjaxError } from 'discourse/lib/ajax-error';
import { default as computed } from 'ember-addons/ember-computed-decorators';
import Topic from 'discourse/models/topic';

export default Ember.Component.extend({
  classNames: 'create-ticket',
  
  actions: {
    convertToTicket() {
      this._toggle();

      const listPriority = this.get('listPriority');
      const listStatus = this.get('listStatus');
      const listReasons = this.get('listReasons');

      let priorityValue = listPriority[0];
      let statusValue = listStatus[0];
      let reasonsValue = listReasons[0];

      const topic = this.get('topic');

      if (topic.tags) {
        topic.tags.forEach((tag) => {
          listPriority.forEach((t) => {
            if (t === tag) priorityValue = t;
          });
          listStatus.forEach((t) => {
            if (t === tag) statusValue = t;
          });
          listReasons.forEach((t) => {
            if (t === tag) reasonsValue = t;
          });
        });
      }

      this.setProperties({
        priorityValue,
        statusValue,
        reasonsValue
      })
    },

    save() {
      Topic.update(this.get('topic'), {
        tags: this._mergeTags()
      }).catch(popupAjaxError).finally(() => {
        this._toggle();
      });
    },

    cancel() {
      this._toggle();
    }
  },

  _settingList(type) {
    return Discourse.SiteSettings[`discourse_ticketing_${type}_tags`].split('|')
  },

  @computed
  listPriority() {
    return this._settingList('priority');
  },

  @computed
  listStatus() {
    return this._settingList('status');
  },

  @computed
  listReasons() {
    return this._settingList('reason');
  },

  _mergeTags() {
    const tags = this.get('topic').tags;

    tags.push('ticket');
    tags.push(this.get('priorityValue'));
    tags.push(this.get('statusValue'));
    tags.push(this.get('reasonsValue'));

    return tags;
  },

  _toggle() {
    const currentState = this.get('createTicketBlock');
    this.set('createTicketBlock', !currentState);
  },
});
