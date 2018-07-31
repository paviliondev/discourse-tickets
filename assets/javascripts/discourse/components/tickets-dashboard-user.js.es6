import { userPath } from "discourse/lib/url";
import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  @computed('user.username')
  userPath(username) {
    return userPath(username);
  }
});
