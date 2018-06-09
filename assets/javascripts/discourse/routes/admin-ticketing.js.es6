import { ajax } from 'discourse/lib/ajax';

export default Ember.Route.extend({
  model() {
    return ajax('/ticketing/tickets.json', {
      type: 'GET',
    }).then(response => response.tickets);
  },
});
