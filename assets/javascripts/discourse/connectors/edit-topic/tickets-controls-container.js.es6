export default {
  setupComponent(attrs, component) {
    const user = Discourse.User.current();
    const enabled = Discourse.SiteSettings.tickets_enabled;
    component.set('showTopicTicket', user.staff && enabled);

    Ember.run.scheduleOnce('afterRender', () => {
      $('.tickets-controls-container').parent().addClass('tickets-controls-container-outlet');
    });
  }
};
