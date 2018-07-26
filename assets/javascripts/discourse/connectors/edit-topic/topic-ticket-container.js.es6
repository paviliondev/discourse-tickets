export default {
  setupComponent(attrs, component) {
    const user = Discourse.User.current();
    const enabled = Discourse.SiteSettings.tickets_enabled;
    component.set('showTopicTicket', user.staff && enabled);
  }
}
