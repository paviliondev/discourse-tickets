import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  tagName: 'span',
  className: 'ticket-user',

  @computed('person')
  path(person) {
    return `/u/${person.username_lower}`
  },
});

