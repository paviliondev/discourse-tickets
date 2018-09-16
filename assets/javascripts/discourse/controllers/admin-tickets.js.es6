import { observes } from 'ember-addons/ember-computed-decorators';
import { generateValueMap } from '../lib/ticket-utilities';
import { ajax } from 'discourse/lib/ajax';

export default Ember.Controller.extend({
  queryParams: ['order', 'filters'],
  filterFields: Ember.A(['tag', 'status', 'priority', 'reason', 'assigned']),
  order: '',
  ascending: true,
  currentFilters: Ember.A(),

  @observes('filterField')
  updateFilterValues() {
    this.set('filterValues', this.get('valueMap')[this.get('filterField')]);
  },

  @observes("order", "ascending", "currentFilters.[]")
  refreshTickets() {
    this.set("refreshing", true);

    let data = {
      order: this.get("order"),
      ascending: this.get("ascending"),
    };

    const currentFilters = this.get('currentFilters');
    if (currentFilters) {
      data['filters'] = currentFilters.map((f) => {
        return `${f.field}:${f.value}`;
      }).join(',');
    };

    ajax('/tickets', { data })
      .then(result => {
        this.setProperties({
          tickets: result,
          valueMap: generateValueMap(result)
        });
      })
      .finally(() => {
        this.set("refreshing", false);
      });
  },

  actions: {
    applyFilter() {
      let field = this.get('filterField');
      this.get('filterFields').removeObject(field);
      this.get('currentFilters').pushObject({
        field,
        value: this.get('filterValue')
      });
    },

    removeFilter(filter) {
      let field = filter.field;
      this.get('filterFields').addObject(field);
      this.get('currentFilters').removeObject(
        this.get('currentFilters').findBy('field', field)
      );
    },

    filterBy(field, value) {
      this.get('currentFilters').pushObject({
        field,
        value
      });
    }
  }
});
