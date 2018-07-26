import { observes } from 'ember-addons/ember-computed-decorators';
import { showModal } from 'discourse/lib/show-modal';

export default Ember.Controller.extend({
  showDashboard: true,

  sorter(a, b, orderKey) {
    const priorityMap = {
        immediate: 0,
        urgent: 1,
        high: 2,
        normal: 3,
        low: 4
    };

    const statusMap = {
      new: 0,
      triaging: 1,
      underway: 2,
      backburner: 3,
      waiting: 4,
      resolved: 5,
    };

    var aValue = 0;
    var bValue = 0;
    if (orderKey === 'title') {
      return (a.title || '').localeCompare((b.title || ''));
    } else if (orderKey === 'dueDate') {
      if (a.dateDue && b.dateDue) {
        return new Date(a.dateDue).getTime() - new Date(b.dateDue).getTime();
      } else {
        return 0;
      }
    } else if (orderKey === 'priority') {
      aValue = priorityMap[a[orderKey]];
      bValue = priorityMap[b[orderKey]];
    } else if (orderKey === 'status') {
      aValue = statusMap[a[orderKey]];
      bValue = statusMap[b[orderKey]];
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
    });
    // ember won't notice that the array changed if you just sort it in place
    this.set('model', [...tickets]);
  }
});
