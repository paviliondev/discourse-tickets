require_dependency 'site_setting'

require_dependency 'topic'
require_dependency 'topic_serializer'

$LOAD_PATH.unshift File.dirname(__FILE__)

Topic.register_custom_field_type('is_ticket', :boolean)

ticket_colors = Tickets::Color.all
if !ticket_colors
  Tickets::Color.set_all(Hash[Tickets::Ticket.allowed.map { |t| [t, nil] }])
end

TAG_SETTINGS = ['tickets_status_tags', 'tickets_reason_tags', 'tickets_priority_tags']

class SiteSetting
  before_save :update_ticket_colors

  def update_ticket_colors
    if TAG_SETTINGS.include?(name)
      ticket_colors = Tickets::Color.all
      ticket_colors.delete_if { |k| Tickets::Ticket.all_tags.exclude?(k) }
      
    end
  end
end

class Topic
  def is_ticket
    if custom_fields['is_ticket']
      ActiveModel::Type::Boolean.new.cast(custom_fields['is_ticket'])
    else
      false
    end
  end
end

class TopicViewSerializer
  attributes :is_ticket

  def is_ticket
    object.topic.is_ticket
  end
end

PostRevisor.track_topic_field(:is_ticket) do |tc, is_ticket|
  tc.record_change('is_ticket', tc.topic.is_ticket, is_ticket)
  tc.topic.custom_fields['is_ticket'] = ActiveModel::Type::Boolean.new.cast(is_ticket)
end

class Site
  def ticket_colors
    @ticket_colors ||= PluginStore.get('tickets', 'ticket_colors')
  end
end

class SiteSerializer
  attributes :ticket_colors

  def ticket_colors
    object.ticket_colors
  end
end
