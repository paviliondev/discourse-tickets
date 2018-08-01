module Tickets
  class Ticket
    def self.find(opts = {})
      tickets = ::Topic.where("id in (
        SELECT topic_id FROM topic_custom_fields
        WHERE name = 'is_ticket' AND value::boolean IS TRUE)"
      )

      if opts[:order]
        direction = opts[:ascending].present? ? 'ASC' : 'DESC'
        order = ''

        case opts[:order]
        when 'title'
          order = 'title'
        when 'status', 'priority', 'reason'
          order = "(SELECT name FROM tags WHERE tags.id IN (
                      SELECT tag_id FROM topic_tags
                      WHERE topic_id = topics.id
                    ) AND tags.id IN (
                      SELECT tag_id FROM tag_group_memberships
                      WHERE tag_group_id IN (
                        SELECT id FROM tag_groups
                        WHERE name = 'tickets_#{opts[:order]}'
                      )
                    )
                   )"
        else
          order = 'created_at'
        end

        tickets = tickets.order("#{order} #{direction}")
      end

      tickets
    end
  end
end
