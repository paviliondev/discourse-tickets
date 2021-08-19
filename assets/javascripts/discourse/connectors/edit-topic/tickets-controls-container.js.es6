import { scheduleOnce } from "@ember/runloop";

export default {
  setupComponent(attrs, component) {
    const user = component.currentUser;
    const enabled = this.siteSettings.tickets_enabled;
    component.set('showTopicTicket', user.staff && enabled);

    scheduleOnce('afterRender', () => {
      $('.tickets-controls-container').parent().addClass('tickets-controls-container-outlet');
    });
  }
};
