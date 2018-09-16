module Tickets
  class Ticket
    def self.find(opts = {})
      tickets = ::Topic.where("id in (
        SELECT topic_id FROM topic_custom_fields
        WHERE name = 'is_ticket' AND value::boolean IS TRUE)"
      )

      if opts[:filters].present?
        opts[:filters].each do |f|
          case f[:field]
          when 'status', 'priority', 'reason'
            tickets = tickets.where("
              (SELECT name FROM tags WHERE tags.id IN (
                  SELECT tag_id FROM topic_tags
                  WHERE topic_id = topics.id
                ) AND tags.id IN (
                  SELECT tag_id FROM tag_group_memberships
                  WHERE tag_group_id IN (
                    SELECT id FROM tag_groups
                    WHERE name = 'tickets_#{f[:field]}'
                  )
                )
               ) = ?", "#{f[:value]}")
          when 'assigned'
            tickets = tickets.where("id IN (
              SELECT topic_id FROM topic_custom_fields
              WHERE topic_custom_fields.name = 'assigned_to_id' AND
              topic_custom_fields.value IN (
                SELECT id::text FROM users
                WHERE users.username LIKE ?
              )
            )", "%#{f[:value]}%")
          when 'tag'
            tickets = tickets.where("id IN (
              SELECT topic_id FROM topic_tags
              WHERE topic_tags.tag_id IN (
                SELECT id FROM tags
                WHERE tags.name = ?
              )
            )", f[:value])
          else
            ## do nothing
          end
        end
      elsif opts[:order].present?
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
        when 'assigned'
          order = "(SELECT value FROM topic_custom_fields
                    WHERE topics.id = topic_custom_fields.topic_id
                    AND topic_custom_fields.name = 'assigned_to_id'
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
