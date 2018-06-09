import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  tagName: 'tr',

  @computed('ticket.dateDue')
  friendlyDueDate(dateDue) {
    return moment(dateDue).fromNow();
  },
});
