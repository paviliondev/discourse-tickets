import { observes, default as discourseComputed } from 'discourse-common/utils/decorators';
import { generateValueMap } from '../lib/ticket-utilities';
import { ajax } from 'discourse/lib/ajax';
import { generateSelectKitContent } from '../lib/ticket-utilities';
import Controller from "@ember/controller";
import { A } from "@ember/array";
import { alias, equal } from "@ember/object/computed";

export default Controller.extend({
  queryParams: ['order', 'filters'],
  filterFields: generateSelectKitContent(A(['tag', 'status', 'priority', 'reason', 'assigned'])),
  order: null,
  asc: true,
  currentFilters: A(),
  page: 0,
  pageStart: alias('offset'),
  previousDisabled: equal('page', 0),

  @discourseComputed('page', 'totalPages')
  nextDisabled(page, totalPages) {
    return page === (totalPages - 1);
  },

  @discourseComputed('page', 'perPage')
  offset(page, perPage) {
    return page * perPage;
  },

  @discourseComputed('total', 'perPage')
  lessThanLimit(total, perPage) {
    return total <= perPage;
  },

  @discourseComputed('offset')
  pageStart(offset) {
    return offset > 0 ? offset + 1 : 0;
  },

  @discourseComputed('offset', 'perPage', 'total')
  pageEnd(offset, perPage, total) {
    let end = offset + perPage;
    return end > total ? total : end;
  },

  @discourseComputed('perPage', 'total')
  totalPages(perPage, total) {
    return Math.ceil(total / perPage);
  },

  @discourseComputed('totalPages', 'page')
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
    this.set('filterValues', generateSelectKitContent(this.get('valueMap')[this.get('filterField')]));
    this.set('filterValue',null);
  },

  @observes("order", "asc", "currentFilters.[]")
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
      ascending: this.get("asc"),
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
