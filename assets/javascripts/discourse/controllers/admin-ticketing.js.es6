export default Ember.Controller.extend({
  showDashboard: true,
  order: 'title',
  ascending: false,
  model: [
    {
      title: 'Hello world',
      status: 'open',
      priority: 'high',
      reason: 'cuz',
      dueDate: Date.now(),
      people: {
        assignedTo: {
          name: 'will'
        }
      }
    },
    {
      title: 'Goodbye, world',
      status: 'closed',
      priority: 'low',
      reason: 'why not',
      dueDate: Date.now(),
      people: {
        assignedTo: {
          name: 'will'
        }
      }
    }
  ]
});

