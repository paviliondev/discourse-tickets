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

const generateValueMap = function(tickets) {
  let valueMap = {
    tag: [],
    status: [],
    priority: [],
    reason: [],
    assigned: []
  };

  tickets.forEach((t) => {
    Object.keys(valueMap).forEach((field) => {
      if (field === 'assigned') {
        if (t[field] && valueMap[field].indexOf(t[field].user.username) === -1) {
          valueMap[field].push(t[field].user.username);
        }
      } else if (field === 'tag') {
        t['tags'].forEach((tag) => {
          if (tag && valueMap[field].indexOf(tag) === -1) {
            valueMap[field].push(tag);
          }
        });
      } else {
        if (t[field] && valueMap[field].indexOf(t[field]) === -1) {
          valueMap[field].push(t[field]);
        }
      }
    });
  });

  return valueMap;
};

export { isTicketTag, allTicketTags, ticketTagGroup, generateValueMap };
