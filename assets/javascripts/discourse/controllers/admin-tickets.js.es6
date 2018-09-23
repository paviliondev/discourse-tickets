import { observes, default as computed } from 'ember-addons/ember-computed-decorators';
import { generateValueMap } from '../lib/ticket-utilities';
import { ajax } from 'discourse/lib/ajax';

export default Ember.Controller.extend({
  queryParams: ['order', 'filters'],
  filterFields: Ember.A(['tag', 'status', 'priority', 'reason', 'assigned']),
  order: '',
  ascending: true,
  currentFilters: Ember.A(),
  page: 0,
  pageStart: Ember.computed.alias('offset'),
  previousDisabled: Ember.computed.equal('page', 0),

  @computed('page', 'totalPages')
  nextDisabled(page, totalPages) {
    return page === (totalPages - 1);
  },

  @computed('page', 'perPage')
  offset(page, perPage) {
    return page * perPage;
  },

  @computed('total', 'perPage')
  lessThanLimit(total, perPage) {
    return total <= perPage;
  },

  @computed('offset')
  pageStart(offset) {
    return offset > 0 ? offset + 1 : 0;
  },

  @computed('offset', 'perPage', 'total')
  pageEnd(offset, perPage, total) {
    let end = offset + perPage;
    return end > total ? total : end;
  },

  @computed('perPage', 'total')
  totalPages(perPage, total) {
    return Math.ceil(total / perPage);
  },

  @computed('totalPages', 'page')
  pages(totalPages, page) {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      let classes = '';
      if (i === (page + 1)) {
        classes += 'btn-primary';
      }
      pages.push({
       number: i,
       classes
      });
    }
    return pages;
  },

  @observes('filterField')
  updateFilterValues() {
    this.set('filterValues', this.get('valueMap')[this.get('filterField')]);
  },

  @observes("order", "ascending", "currentFilters.[]")
  refreshTickets() {
    this.set("refreshing", true);
    this.getTickets().then(() => {
      this.set("refreshing", false);
    });
  },

  getTickets(page) {
    this.set('refreshing', true);

    let data = {
      order: this.get("order"),
      ascending: this.get("ascending"),
    };

    if (page) {
      data['page'] = page;
    }

    const currentFilters = this.get('currentFilters');
    if (currentFilters) {
      data['filters'] = currentFilters.map((f) => {
        return `${f.field}:${f.value}`;
      }).join(',');
    };

    return ajax('/tickets', { data })
      .then(result => {
        this.setProperties({
          tickets: result.tickets,
          total: result.total,
          perPage: result.per_page,
          page: result.page,
          valueMap: generateValueMap(result.tickets)
        });
      }).finally(() => this.set('refreshing', false));
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
    },

    nextPage() {
      this.getTickets(this.get('page') + 1);
    },

    previousPage() {
      let page = this.get('page') - 1;
      this.getTickets(page < 0 ? 0 : page);
    },

    goToPage(page) {
      this.getTickets(page - 1);
    }
  }
});
