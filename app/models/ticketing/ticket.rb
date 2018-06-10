module Ticketing
  class Ticket
    def self.find(key)
      type, id = key.split('-')
      ticket_base = case type
               when 'topic'
                 Topic.find(id)
               when 'post'
                 Post.find(id)
               else
                 raise NotImplementedError
               end
      new(ticket_base)
    end

    def self.all
      Collection.new
    end

    attr_accessor :_topic_or_post
    delegate :id, :created_at, :title, :tags, to: :_topic_or_post

    def initialize(topic_or_post)
      self._topic_or_post = topic_or_post
    end

    def to_hash
      {
        id: id,
        topic_or_post: 'topic',
        dateCreated: created_at,
        title: title,
        priority: priority,
        status: status,
        dateDue: date_due,
        assignee: assignee,
        creator: creator,
        href: Engine.routes.url_helpers.ticket_url(self, host: 'example.com')
      }.reverse_merge(a_ticket_blob)
    end

    def to_param
      "topic-#{id}"
    end

    def priority
      TagGroupConfiguration.extract_priority_tag_names_from(tags).first
    end

    def status
      TagGroupConfiguration.extract_status_tag_names_from(tags).first
    end

    def date_due
      created_at + TagGroupConfiguration.sla_for_priority(priority)
    end

    private

    def assignee
      # assigned_to_user is defined in the discourse-assign plugin
      # At some point, would we want to have a check here if the plugin isn't available?
      result = BasicUserSerializer.new(_topic_or_post.assigned_to_user).as_json[:basic_user]
      result.merge(username_lower: result[:username].downcase) if result
    end

    def creator
      user = User.find_by(id: _topic_or_post.custom_fields["assigned_by_id"])
      return unless user
      result = BasicUserSerializer.new(user).as_json[:basic_user]
      result.merge(username_lower: result[:username].downcase) if result
    end

    def a_ticket_blob
      {
        "id": 3424,
        "topicOrPost": 'post',
        "title": "A Cool Ticket",
        "priority": 'high',
        "status": 'waiting',
        "dateCreated": "2018-06-09T15:59:55.725Z",
        "dateDue": "2018-06-09T15:59:55.725Z",
        "involvedUsers": [
          {
            "id":3,
            "username":"howardm",
            "avatar_template":"/letter_avatar_proxy/v2/letter/h/f19dbf/{size}.png",
            "active":false,
            "admin":false,
            "moderator":false,
            "last_seen_at":nil,
            "last_emailed_at": "2018-06-09T15:59:55.725Z",
            "created_at": "2018-06-09T15:59:47.937Z",
            "last_seen_age":nil,
            "last_emailed_age":7156.707830402,
            "created_at_age":7164.495096115,
            "username_lower":"howardm",
            "trust_level":1,
            "manual_locked_trust_level":nil,
            "flag_level":0,
            "title":nil,
            "suspended":false,
            "time_read":0,
            "staged":false,
            "days_visited":0,
            "posts_read_count":0,
            "topics_entered":0,
            "post_count":0
          }
        ],
        "href": Engine.routes.url_helpers.ticket_url(host: 'example.com', id: 'post-1234', format: 'json')
       }
    end

    def self.order(attribute, asc_or_desc = :asc)
      Collection.new.order(attribute, asc_or_desc)
    end

    def self.filter(filter_string)
      Collection.new.filter(filter_string)
    end

    class Collection
      include Enumerable

      def initialize
        self.source_relation = base_relation
      end

      def to_a
        source_relation.map { |item| collected_class.new(item) }
      end

      def order(attribute, asc_or_desc = :asc)
        case attribute.to_sym
        when :title
          self.source_relation = source_relation.order(title: asc_or_desc)
        when :priority
          self.source_relation = source_relation.order(tags: tag_order_clause(:priority) + [asc_or_desc] )
        when :status
          self.source_relation = source_relation.order(tags: tag_order_clause(:status) + [asc_or_desc])
        else
          raise NotImplementedError
        end

        self
      end

      def filter(filter_string)
        # given the filter string "status:waiting status:new priority:high random search term"
        # this horrifying function chain should generate a data structure that looks like
        # {
        #   'status': ['waiting', 'new'],
        #   'priority': ['high']
        # }
        filters = filter_string
                    .split("/\w+/")
                    .map { |str| name, value = str.split(':'); { name: name, value: value } }
                    .filter { |filter| filter.name.in? %w(priority status) }
                    .group_by { |filter| filter.name }
                    .each_with_index({}) { |(key, filters), result| result[key] = filters.map { |f| f.value } }

        if filters.has_key?('status')
          self.source_relation = source_relation.where(tags: { name: filters['status'] })
        end
        if filters.has_key?('priority')
          self.source_relation = source_relation.where(tags: { name: filters['priority'] })
        end

        self
      end

      private
      attr_accessor :source_relation

      private def base_relation
        # TODO: add or clause for any ticket that is assigned
        ::Topic.joins(:tags).where(tags: { name: 'ticket' })
      end

      private def collected_class
        Ticket
      end

      private def tag_order_clause(tag_group_name)
        ["array_position(?, tags.name) ?", TagGroupConfiguration.ordered_tag_names_for(tag_group_name)]
      end
    end
  end
end
