import { default as discourseComputed, observes } from 'discourse-common/utils/decorators';
import { isTicketTag } from '../lib/ticket-utilities';
import showModal from 'discourse/lib/show-modal';
import { ajax } from 'discourse/lib/ajax';
import { generateSelectKitContent } from '../lib/ticket-utilities';
import Component from "@ember/component";
import { not } from "@ember/object/computed";
import { inject as service } from "@ember/service";

const ticketTypes = ['priority', 'status', 'reason'];

export default Component.extend({
  classNames: 'tickets-controls',
  notTicket: not('topic.is_ticket'),
  includeUsernames: null,
  hasGroups: null,
  taskActions: service(),

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

      if (list && currentTags) {
        value = currentTags.find(t => list.indexOf(t) > -1);
      }

      let props = {};
      props[type] = value;
      props[`${type}List`] = generateSelectKitContent(list);
      props[`${type}None`] = { name: I18n.t('tickets.topic.select', { type }) };

      this.setProperties(props);
    });

    if (topic.get('archetype') == 'private_message') {
      let includeGroup = this.siteSettings.tickets_include_group;

      const currentGroups = topic.get('content.details.allowed_groups');
      if (currentGroups && currentGroups.length) {
        let names = currentGroups.map((cg) => cg.name);
        if (names.indexOf(includeGroup) > -1) includeGroup = null;
      }

      if (includeGroup) {
        this.setProperties({
          includeUsernames: [includeGroup],
          hasGroups: true
        });

        this.includedChanged();
      }
    }
  },

  @discourseComputed('topic.is_ticket')
  toggleClasses(isTicket) {
    let classes = 'toggle-ticket';
    if (isTicket) classes += ' btn-primary';
    return classes;
  },

  @discourseComputed
  showInclude() {
    return this.get('topic.archetype') === 'private_message';
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
    let list = this.get(`${ticketType}List`)
                .map(function(value) {
                  return value.name;
                });
    let tags = topic.get('tags') || [];

    if (list) {
      tags = tags.filter(t => list.indexOf(t) === -1);
    }

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

  includedChanged() {
    const hasGroups = this.get('hasGroups');
    const usernames = this.get('includeUsernames');
    let type = hasGroups ? 'groups' : 'users';
    this.set(`topic.allowed_${type}`, usernames.join(","));
  },

  actions: {
    toggleIsTicket() {
      this.toggleProperty('topic.is_ticket');
    },

    unassign(){
      this.taskActions.unassign(this.get('topic.id'), 'Topic');
    },

    assign(){
      this.taskActions.assign(this.get('topic'));
    },

    updateIncludeUsernames(selected, content) {
      if (!content.length) {
        this.setProperties({
          includeUsernames: [],
          hasGroups: false
        });
      } else {
        this.setProperties({
          includeUsernames: selected,
          hasGroups: content[0].isGroup || false
        });
      }
      this.includedChanged();
    },
  }
});
