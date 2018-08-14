import { ajax } from 'discourse/lib/ajax';

export default Ember.Route.extend({
  model(params) {
    return ajax('/tickets', {
      data: {
        order: params.order
      }
    });
  }
});
