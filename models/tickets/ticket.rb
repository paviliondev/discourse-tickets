module Tickets
  class Ticket
    def self.all
      ::Topic.where("id in (
        SELECT topic_id FROM topic_custom_fields
        WHERE name = 'is_ticket' AND value::boolean IS TRUE)"
      )
    end

    def self.type_tag(tags, type)
      type_tags = SiteSetting.send("tickets_#{type}_tags").split('|')
      tags.select { |t| type_tags.include? t }.first
    end
  end
end
