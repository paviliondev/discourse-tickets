export default {
  resource: 'admin',
  map() {
    this.route('adminTicketing', { path: 'ticketing', resetNamespace: true });
  }
};

