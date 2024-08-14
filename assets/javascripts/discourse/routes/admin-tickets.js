import { ajax } from 'discourse/lib/ajax';
import { generateValueMap } from '../lib/ticket-utilities';
import Route from "@ember/routing/route";
import { A } from "@ember/array";

export default Route.extend({
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

    if (params['page']) {
      data['page'] = params['page'];
    }

    if (params['per_page']) {
      data['per_page'] = params['per_page'];
    }

    this.set('currentFilters', A(currentFilters));

    return ajax('/tickets', { data });
  },

  setupController(controller, model) {
    controller.setProperties({
      currentFilters: this.get('currentFilters'),
      tickets: model.tickets,
      total: model.total,
      perPage: model.per_page,
      page: model.page,
      order: null,
      asc: null,
      valueMap: generateValueMap(model.tickets)
    });
  },

  actions: {
    deactivate() {
      this.set('currentFilters', null);
      this.controllerFor('admin-tickets').set('currentFilters', null);
    },
  }
});
