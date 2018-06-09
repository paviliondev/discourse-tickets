import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default Ember.Component.extend({
  actions: {
    convertToTicket() {
      var current_state = this.get('create_ticket_block');
      this.set('create_ticket_block', !current_state);

      this.set('list-priority', this.priority());
      this.set('list-status', this.status());
      this.set('list-reasons', this.reasons());

      const topic = this.get('topic');

      this.set(`priority-value`, this.priority()[0]);
      this.set(`status-value`, this.status()[0]);
      this.set(`reasons-value`, this.reasons()[0]);

      topic.tags.forEach((tag) => {
        const parts = tag.split('-');
        const category = parts[0];
        if (category === 'priority') {
          this.set(`priority-value`, tag);
        }
        else if (category === 'reason') {
          this.set(`reasons-value`, tag);
        }
        else if (category === 'status') {
          this.set(`status-value`, tag);
        }
      });

      var that = this;
      return ajax("/u/search/users?group=staff", {
        type: 'GET',
      }).then((users) => {
        that.set('list-users', users.users);
        that.set(`user-value`, users.users[0].username);
      }).catch(popupAjaxError)
      .finally(() => {});
    },

    save() {
      console.log(this.get('user-value'));
      console.log(this.get('priority-value'));
    },

    cancel() {
      console.log('qwer');
    },

    set_users(event) {
      this.set(`user-value`, event);
    },

    set_priority(event) {
      this.set(`priority-value`, event);
    },

    set_status(event) {
      this.set(`status-value`, event);
    },

    set_reasons(event) {
      this.set(`reasons-value`, event);
    }
  },

  priority() {
    return [
      { "id": "priority-high" },
      { "id": "priority-immediate" },
      { "id": "priority-low" },
      { "id": "priority-normal" },
      { "id": "priority-urgent" }
    ];
  },

  status() {
    return [
      { "id": "status-backburner" },
      { "id": "status-new" },
      { "id": "status-resolved" },
      { "id": "status-triaging" },
      { "id": "status-underway" },
      { "id": "status-waiting" }
    ];
  },

  reasons() {
    return [
      { "id":"reason-appealforhelp" },
      { "id":"reason-bademail" },
      { "id":"reason-cancelaccount" },
      { "id":"reason-confirmemail" },
      { "id":"reason-coreapp" },
      { "id":"reason-exchange" },
      { "id":"reason-forumpost" },
      { "id":"reason-forumtopic" },
      { "id":"reason-memberprofile" },
      { "id":"reason-networkinvite" },
      { "id":"reason-nps" },
      { "id":"reason-onboarding" },
      { "id":"reason-orgprofile" },
      { "id":"reason-partnership" },
      { "id":"reason-resource" },
      { "id":"reason-skypecall" },
      { "id":"reason-topicmerge" },
      { "id":"reason-username" },
      { "id":"reason-webinar" }
    ];
  }
});
