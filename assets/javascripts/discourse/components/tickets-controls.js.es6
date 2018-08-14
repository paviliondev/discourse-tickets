import { default as computed, observes } from 'ember-addons/ember-computed-decorators';
import { isTicketTag } from '../lib/ticket-utilities';
import showModal from 'discourse/lib/show-modal';
import { ajax } from 'discourse/lib/ajax';

const ticketTypes = ['priority', 'status', 'reason'];

export default Ember.Component.extend({
  classNames: 'tickets-controls',
  notTicket: Ember.computed.not('topic.is_ticket'),

  didInsertElement() {
    this.setup();
  },

  setup() {
    const topic = this.get('topic');
    const ticketTags = this.get('site.ticket_tags');
    const currentTags = topic.get('tags');

    ticketTypes.forEach((type) => {
      let list = ticketTags[type];
      let value = '';

      if (currentTags) {
        value = currentTags.find(t => list.indexOf(t) > -1);
      }

      let props = {};
      props[type] = value;
      props[`${type}List`] = list;
      props[`${type}None`] = { name: I18n.t('tickets.topic.select', { type }) };

      this.setProperties(props);
    });
  },

  @computed('topic.is_ticket')
  toggleClasses(isTicket) {
    let classes = 'toggle-ticket';
    if (isTicket) classes += ' btn-primary';
    return classes;
  },

  @observes('priority', 'status', 'reason')
  updateOnChange(sender, key) {
    this.updateTicket(key);
  },

  @observes('topic.is_ticket')
  updateOnToggle() {
    const isTicket = this.get('topic.is_ticket');
    if (isTicket) {
      this.addTickets();
    } else {
      this.removeTickets();
    }
  },

  updateTicket(ticketType) {
    const topic = this.get('topic');
    let ticket = this.get(ticketType);
    let list = this.get(`${ticketType}List`);
    let tags = topic.get('tags') || [];

    tags = tags.filter(t => list.indexOf(t) === -1);

    if (ticket) {
      tags.push(ticket);
    }

    topic.set('tags', tags);
  },

  addTickets() {
    ticketTypes.forEach((type) => this.updateTicket(type));
  },

  removeTickets() {
    const topic = this.get('topic');
    let tags = topic.get('tags');

    if (tags) {
      tags = tags.filter(t => !isTicketTag(t));
      topic.set('tags', tags);
    }
  },

  actions: {
    toggleIsTicket() {
      this.toggleProperty('topic.is_ticket');
    },

    unassign(){
      this.set('topic.assigned_to_user', null);

      return ajax("/assign/unassign", {
        type: 'PUT',
        data: { topic_id: this.get('topic.id')}
      });
    },

    assign(){
      showModal("assign-user", {
        model: {
          topic: this.get('topic'),
          username: this.get('topic.assigned_to_user.username')
        }
      });
    }
  }
});
