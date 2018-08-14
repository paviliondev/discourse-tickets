let allTicketTags = function(site) {
  const ticketTags = site.ticket_tags;
  let result = [];

  if (ticketTags) {
    return result.concat.apply([], Object.keys(ticketTags).map((type) => {
      return ticketTags[type];
    }));
  } else {
    return result;
  }
};

const isTicketTag = function(tag, site = Discourse.Site.current()) {
  return allTicketTags(site).indexOf(tag) > -1;
};

const ticketTagGroup = function(tag) {
  const ticketTags = Discourse.Site.currentProp('ticket_tags');
  let group = null;
  Object.keys(ticketTags).forEach((g) => {
    if (ticketTags[g].indexOf(tag) > -1) {
      group = g;
    }
  });
  return group;
};

export { isTicketTag, allTicketTags, ticketTagGroup };
