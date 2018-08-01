import { observes } from 'ember-addons/ember-computed-decorators';
import { ajax } from 'discourse/lib/ajax';

export default Ember.Controller.extend({
  order: '',
  ascending: true,

  @observes("order", "ascending")
  _refreshTickets() {
    this.set("refreshing", true);

    console.log(this.get('order'), this.get('ascending'));

    ajax('/tickets', {
      data: {
        order: this.get("order"),
        ascending: this.get("ascending")
      }
    })
      .then(result => {
        this.set("model", result);
      })
      .finally(() => {
        this.set("refreshing", false);
      });
  }
});
