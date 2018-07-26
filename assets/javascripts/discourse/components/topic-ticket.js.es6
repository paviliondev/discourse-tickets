import { popupAjaxError } from 'discourse/lib/ajax-error';
import { default as computed, observes } from 'ember-addons/ember-computed-decorators';
import Topic from 'discourse/models/topic';

const ticketTypes = ['priority', 'status', 'reason'];

export default Ember.Component.extend({
  classNames: 'topic-ticket',
  notTicket: Ember.computed.not('topic.is_ticket'),

  didInsertElement() {
    Ember.$(document).on('click', Ember.run.bind(this, this.documentClick));
    this._setup();
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

  _setup() {
    const topic = this.get('topic');
    const currentTags = topic.get('tags');

    ticketTypes.forEach((type) => {
      let list = Discourse.SiteSettings[`tickets_${type}_tags`].split('|');
      let value = '';

      if (currentTags) {
        value = currentTags.find(t => list.indexOf(t) > -1);
      }

      let props = {}
      props[type] = value;
      props[`${type}List`] = list;
      props[`${type}None`] = { name: I18n.t('tickets.topic.select', { type }) };

      this.setProperties(props);
    });
  },

  @observes('priority', 'status', 'reason')
  updateOnChange(sender, key) {
    this._updateTicket(key);
  },

  @observes('topic.is_ticket')
  updateOnToggle() {
    const isTicket = this.get('topic.is_ticket');
    if (isTicket) {
      this._addTickets();
    } else {
      this._removeTickets();
    }
  },

  _updateTicket(type) {
    const topic = this.get('topic');
    let ticket = this.get(type);

    if (ticket) {
      let list = this.get(`${type}List`);
      let tags = topic.get('tags') || [];

      tags = tags.filter(t => list.indexOf(t) === -1);
      tags.push(ticket);

      topic.set('tags', tags);
    }
  },

  _addTickets() {
    ticketTypes.forEach((type) => this._updateTicket(type));
  },

  _removeTickets() {
    const topic = this.get('topic');
    const allTickets = this._listAllTickets();
    let tags = topic.get('tags');

    if (tags) {
      tags = tags.filter(t => allTickets.indexOf(t) === -1);
      topic.set('tags', tags);
    }
  },

  _listAllTickets() {
    let tickets = []
    ticketTypes.forEach(t => {
      tickets = tickets.concat(Discourse.SiteSettings[`tickets_${t}_tags`].split('|'))
    });
    return tickets;
  }
});
