export default {
  resource: 'admin',
  map() {
    this.route('adminTickets', { path: 'tickets', resetNamespace: true });
  }
};

