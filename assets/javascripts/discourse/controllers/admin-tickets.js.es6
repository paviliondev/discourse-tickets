import { observes } from 'ember-addons/ember-computed-decorators';
import { ajax } from 'discourse/lib/ajax';

export default Ember.Controller.extend({
  queryParams: ['order', 'filter'],
  fields: ['title', 'status', 'priority', 'reason', 'assigned'],
  order: '',
  ascending: true,

  @observes("order", "ascending")
  orderChanged() {
    this.refreshTickets();
  },

  refreshTickets() {
    this.set("refreshing", true);

    ajax('/tickets', {
      data: {
        order: this.get("order"),
        ascending: this.get("ascending"),
        filter: this.get('filter')
      }
    })
      .then(result => {
        this.set("model", result);
      })
      .finally(() => {
        this.set("refreshing", false);
      });
  },

  actions: {
    filter() {
      this.refreshTickets();
    }
  }
});
