module Tickets
  class Tag
    PRIORITY = 'priority'
    REASON = 'reason'
    STATUS = 'status'

    GROUP_PREFIX = "tickets"
    GROUPS = [
      "#{GROUP_PREFIX}_#{PRIORITY}",
      "#{GROUP_PREFIX}_#{REASON}",
      "#{GROUP_PREFIX}_#{STATUS}"
    ]

    def self.for_type(tags, type)
      ticket_tags = ::Site.ticket_tags
      tags.select { |t| ticket_tags[type].include? t }.first
    end
  end
end
