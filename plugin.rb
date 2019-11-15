# name: discourse-tickets
# about: Tickets system for Discourse
# version: 0.1
# authors:
# url: https://github.com/angusmcleod/discourse-tickets

register_asset 'stylesheets/tickets.scss'

load File.expand_path('../lib/tickets/validator.rb', __FILE__)

after_initialize do
  load File.expand_path('../lib/tickets/engine.rb', __FILE__)
  load File.expand_path("../lib/tickets/guardian.rb", __FILE__)
  load File.expand_path('../lib/tickets/routes.rb', __FILE__)
  load File.expand_path("../lib/tickets/topic.rb", __FILE__)
  load File.expand_path("../lib/tickets/ticket.rb", __FILE__)
  load File.expand_path("../lib/tickets/tag.rb", __FILE__)
  load File.expand_path("../controllers/tickets/tickets_controller.rb", __FILE__)
  load File.expand_path("../serializers/tickets/ticket_serializer.rb", __FILE__)

  register_seedfu_fixtures(Rails.root.join("plugins", "discourse-tickets", "db", "fixtures").to_s)

  add_class_method(:site, :ticket_tags) do
    Tag.joins('JOIN tag_group_memberships ON tags.id = tag_group_memberships.tag_id')
      .joins('JOIN tag_groups ON tag_group_memberships.tag_group_id = tag_groups.id')
      .where('tag_groups.name in (?)', Tickets::Tag::GROUPS)
      .group('tag_groups.name, tags.name', 'tag_group_memberships.created_at')
      .order('tag_group_memberships.created_at')
      .pluck('tag_groups.name, tags.name')
      .each_with_object({}) do |arr, result|
        type = arr[0].split("_").last
        result[type] = [] if result[type].blank?
        result[type].push(arr[1])
      end
  end

  module DiscourseTaggingExtension
    def filter_allowed_tags(guardian, opts = {})
      result = super(guardian, opts)
      
      if opts[:for_input]
        ticket_tag_ids = Tag.joins('JOIN tag_group_memberships ON tags.id = tag_group_memberships.tag_id')
          .joins('JOIN tag_groups ON tag_group_memberships.tag_group_id = tag_groups.id')
          .where('tag_groups.name in (?)', Tickets::Tag::GROUPS).pluck(:id)
        result = result.select { |tag| ticket_tag_ids.exclude? tag.id }
      end

      result
    end
  end

  require_dependency 'discourse_tagging'
  class << DiscourseTagging
    prepend DiscourseTaggingExtension
  end

  add_to_serializer(:site, :ticket_tags) { ::Site.ticket_tags }
  add_to_serializer(:site, :include_ticket_tags?) { SiteSetting.tickets_enabled }
end
