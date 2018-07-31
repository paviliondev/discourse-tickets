module Tickets
  class Ticket
    def self.all
      ::Topic.where("id in (
        SELECT topic_id FROM topic_custom_fields
        WHERE name = 'is_ticket' AND value::boolean IS TRUE)"
      )
    end
  end
end
