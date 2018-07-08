import renderTags from 'discourse/lib/render-tags';
import renderTag from 'discourse/lib/render-tag';

export default {
  name: 'tickets-edits',
  initialize() {
    const existingRenderTags = renderTags.prototype;
    renderTags.prototype = function(topic, params) {
      if (topic.is_ticket) {
        const ticketColors = Discourse.Site.currentProp('ticket_colors');
        const styleSetting = Discourse.SiteSettings.tag_style;

        let tags = topic.tags;
        let buffer = "";

        if (tags && tags.length > 0) {
          buffer = "<div class='discourse-tags'>";
          if (tags) {
            for (let i = 0; i < tags.length; i++) {
              let tag = tags[i];
              let style = [styleSetting];
              if (ticketColors[tag]) style.push(ticketColors[tag]);
              buffer += renderTag(tag, { style }) + " ";
            }
          }
          buffer += "</div>";
        }

        return buffer;
      } else {
        return existingRenderTags(topic, params);
      }
    };
  }
};
