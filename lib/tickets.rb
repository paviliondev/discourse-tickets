Topic.register_custom_field_type('is_ticket', :boolean)

require_dependency 'topic'
class Topic
  def is_ticket
    if custom_fields['is_ticket']
      ActiveModel::Type::Boolean.new.cast(custom_fields['is_ticket'])
    else
      false
    end
  end
end

require_dependency 'topic_view_serializer'
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
