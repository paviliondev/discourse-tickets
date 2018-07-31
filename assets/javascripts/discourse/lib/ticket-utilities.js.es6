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

export { isTicketTag, allTicketTags };
