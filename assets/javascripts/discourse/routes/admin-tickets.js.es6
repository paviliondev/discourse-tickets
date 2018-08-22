import { ajax } from 'discourse/lib/ajax';
import { generateValueMap } from '../lib/ticket-utilities';

export default Ember.Route.extend({
  model(params) {
    let data = {};

    if (params['order']) {
      data['order'] = params['order'];
    }

    let currentFilters = [];

    if (params['filters']) {
      currentFilters = params['filters'].split(',').map((f) => {
        let arr = f.split(':');
        return { "field": arr[0], "value": arr[1] };
      });

      data['filters'] = params['filters'];
    }

    this.set('currentFilters', Ember.A(currentFilters));

    return ajax('/tickets', { data });
  },

  setupController(controller, model) {
    let tickets = model;

    controller.setProperties({
      currentFilters: this.get('currentFilters'),
      tickets,
      valueMap: generateValueMap(tickets)
    });
  },

  actions: {
    deactivate() {
      this.set('currentFilters', null);
      this.controllerFor('admin-tickets').set('currentFilters', null);
    },
  }
});
