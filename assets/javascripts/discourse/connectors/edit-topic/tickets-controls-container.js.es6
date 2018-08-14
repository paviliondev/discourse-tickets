export default {
  setupComponent(attrs, component) {
    const user = Discourse.User.current();
    const enabled = Discourse.SiteSettings.tickets_enabled;
    const mobileView = component.get('site.mobileView');
    component.set('showTopicTicket', user.staff && enabled && !mobileView);

    Ember.run.scheduleOnce('afterRender', () => {
      $('.tickets-controls-container').parent().addClass('tickets-controls-container-outlet');
    });
  }
};
