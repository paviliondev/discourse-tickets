import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['ticket-user'],

  @computed('person')
  path(person) {
    return `/u/${person.username_lower}`
  },
});

