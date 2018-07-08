import { popupAjaxError } from 'discourse/lib/ajax-error';
import { default as computed } from 'ember-addons/ember-computed-decorators';
import Topic from 'discourse/models/topic';

export default Ember.Component.extend({
  classNames: 'topic-ticket',
  notTicket: Ember.computed.not('isTicket'),

  didInsertElement() {
    Ember.$(document).on('click', Ember.run.bind(this, this.documentClick));
  },

  willDestroyElement() {
    Ember.$(document).off('click', Ember.run.bind(this, this.documentClick));
  },

  documentClick(e) {
    let $element = this.$();
    let $target = $(e.target);
    if ($target.closest($element).length < 1 &&
        this._state !== 'destroying') {
      this.set('editing', false);
    }
  },

  @computed('currentUser')
  canEditTicket(currentUser) {
    return currentUser.staff;
  },

  @computed('topic.is_ticket')
  toggleEditBtnClasses(isTicket) {
    let classes = 'toggle-ticket-edit btn-small';
    if (isTicket) classes += ' btn-primary';
    return classes;
  },

  actions: {
    toggleEditing() {
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

      let isTicket = topic.is_ticket;

      this.setProperties({
        priorityValue,
        statusValue,
        reasonsValue,
        isTicket,
        editing: true
      });
    },

    save() {
      const topic = this.get('topic');
      const tags = this.updateTags();

      Topic.update(topic, {
        tags,
        is_ticket: this.get('isTicket')
      }).catch(popupAjaxError).finally(() => {
        this.set('editing', false);
      });
    },

    cancel() {
      this.set('editing', false);
    }
  },

  settingList(type) {
    return Discourse.SiteSettings[`tickets_${type}_tags`].split('|');
  },

  @computed
  listPriority() {
    return this.settingList('priority');
  },

  @computed
  listStatus() {
    return this.settingList('status');
  },

  @computed
  listReasons() {
    return this.settingList('reason');
  },

  updateTags() {
    const topic = this.get('topic');
    const combinedList = this.get('listStatus')
      .concat(this.get('listPriority'))
      .concat(this.get('listReasons'));;

    let tags = topic.tags;

    tags = tags.filter((t) => combinedList.indexOf(t) === -1);

    if (this.get('isTicket')) {
      tags.push(this.get('priorityValue'));
      tags.push(this.get('statusValue'));
      tags.push(this.get('reasonsValue'));
    }

    return tags;
  }
});
