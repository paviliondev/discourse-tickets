import { observes } from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  showDashboard: true,

  sorter(a, b, orderKey) {
    const priorityMap = {
        immediate: 0,
        urgent: 1,
        high: 2,
        normal: 3,
        low: 4
    }
    var aValue = 0;
    var bValue = 0;
    if (orderKey === 'priority') {
      aValue = priorityMap[a[orderKey]];
      bValue = priorityMap[b[orderKey]];
    }
    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  },

  // Take a look at https://git.io/vh2XE for a possible way of implementing table headers sort?
  order: null,
  ascending: null,
  @observes('order', 'ascending')
  _refreshTags() {
    var order = this.order;
    var ascending = this.ascending;
    var tickets = this.get('model');
    tickets.sort((a, b) => {
      var value = this.sorter(a, b, order);
      if (!ascending) {
        value = value * -1;
      }
      return value;
    })
    // ember won't notice that the array changed if you just sort it in place
    this.set('model', [...tickets]);
  }
});

