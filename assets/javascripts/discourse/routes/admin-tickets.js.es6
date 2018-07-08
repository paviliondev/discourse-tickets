import { ajax } from 'discourse/lib/ajax';

export default Ember.Route.extend({
  model() {
    return ajax('/tickets/tickets.json', {
      type: 'GET',
    }).then(response => response.tickets);
  },
});
