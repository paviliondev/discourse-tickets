import { withPluginApi } from 'discourse/lib/plugin-api';
import { default as computed } from 'ember-addons/ember-computed-decorators';
import { escapeExpression } from "discourse/lib/utilities";
import { isTicketTag, ticketTagGroup } from '../lib/ticket-utilities';

export default {
  name: 'discourse-tickets-initializer',
  initialize(container) {
    const currentUser = container.lookup('current-user:main');

    withPluginApi('0.8.13', api => {
      api.modifyClass('component:mini-tag-chooser', {
        willComputeAsyncContent(content) {
          // forbidden tickets are added manually, so we remove them manually
          if (content && content[0] && isTicketTag(content[0].id)) {
            content.shift();
          }
          return content;
        },

        @computed("tags")
        selection(tags) {
          return this._super(tags).filter((t) => !isTicketTag(t.value));
        },

        @computed("tags.[]", "filter", "highlightedSelection.[]")
        collectionHeader(tags, filter, highlightedSelection) {
          if (!Ember.isEmpty(tags)) {
            let output = "";

            if (tags.length >= 20) {
              tags = tags.filter(t => t.indexOf(filter) >= 0);
            }

            // discourse-tickets addition
            tags = tags.filter((t) => !isTicketTag(t));
            //

            tags.map(tag => {
              tag = escapeExpression(tag);
              const isHighlighted = highlightedSelection
                .map(s => Ember.get(s, "value"))
                .includes(tag);
              output += `
                <button aria-label="${tag}" title="${tag}" class="selected-tag ${
                isHighlighted ? "is-highlighted" : ""
              }" data-value="${tag}">
                  ${tag}
                </button>
              `;
            });

            return `<div class="selected-tags">${output}</div>`;
          }
        },
      });

      // eventually this should be replaced with a filter in lib/render-tags
      // (currently have to override the entire library to achieve this)
      let hideTicketTags = function() {
        Ember.run.scheduleOnce('afterRender', () => {
          $('.discourse-tags').children().each(function() {
            if ($(this).hasClass('discourse-tag') &&
                !$(this).hasClass('ticket') &&
                !$(this).hasClass('assigned-to')) {
              let tag = $(this).text();
              if (isTicketTag(tag)) $(this).hide();
            }
          });
        });
      };

      api.addTagsHtmlCallback((topic) => {
        if (topic.is_ticket && topic.tags && currentUser.staff) {
          hideTicketTags();

          const icon = Discourse.SiteSettings.tickets_icon;
          const ticketTags = topic.tags.filter(t => isTicketTag(t));

          let html = `<i class='fa fa-${icon} ticket-icon'></i>`;

          ticketTags.forEach((t) => {
            let group = ticketTagGroup(t);
            html += `<a href='/admin/tickets?order=${group}' class='ticket discourse-tag simple'>${t}</a>`;
          });

          return html;
        }
      });
    });
  }
};
