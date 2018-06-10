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
      [new.send(:a_ticket_blob)]
    end

    attr_accessor :_topic_or_post
    delegate :id, :created_at, :title, to: :_topic_or_post

    def initialize(topic_or_post)
      self._topic_or_post = topic_or_post
    end

    def to_hash
      {
        id: id,
        topic_or_post: 'topic',
        dateCreated: created_at,
        title: title,
        href: Engine.routes.url_helpers.ticket_url(self, host: 'example.com')
      }.reverse_merge(a_ticket_blob)
    end

    def to_param
      "topic-#{id}"
    end

    private def a_ticket_blob
      {
        "id": 3424,
        "topicOrPost": 'post',
        "title": "A Cool Ticket",
        "priority": 'high',
        "status": 'waiting',
        "dateCreated": "2018-06-09T15:59:55.725Z",
        "dateDue": "2018-06-09T15:59:55.725Z",
        "assignee": {
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
        },
        "creator": {
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
        },
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
  end
end
