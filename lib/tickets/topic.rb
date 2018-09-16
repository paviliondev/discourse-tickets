Topic.register_custom_field_type('is_ticket', :boolean)
TopicList.preloaded_custom_fields << 'is_ticket' if TopicList.respond_to? :preloaded_custom_fields

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

require_dependency 'topic_list_item_serializer'
class TopicListItemSerializer
  attributes :is_ticket

  def is_ticket
    object.is_ticket
  end
end

PostRevisor.track_topic_field(:is_ticket) do |tc, is_ticket|
  if tc.guardian.can_create_ticket?(tc.topic)
    tc.record_change('is_ticket', tc.topic.is_ticket, is_ticket)
    tc.topic.custom_fields['is_ticket'] = ActiveModel::Type::Boolean.new.cast(is_ticket)
  end
end

PostRevisor.track_topic_field(:allowed_groups) do |tc, allowed_groups|
  tc.record_change('allowed_groups', tc.topic.allowed_groups, allowed_groups)

  names = allowed_groups.split(',').flatten
  Group.where(name: names).each do |group|
    tc.topic.topic_allowed_groups.build(group_id: group.id)
    group.update_columns(has_messages: true) unless group.has_messages
  end
end

PostRevisor.track_topic_field(:allowed_users) do |tc, allowed_users|
  tc.record_change('allowed_users', tc.topic.allowed_users, allowed_users)

  names = allowed_users.split(',').flatten

  User.includes(:user_option).where(username: names).find_each do |user|
    tc.topic.topic_allowed_users.build(user_id: user.id)
  end
end

DiscourseEvent.on(:post_created) do |post, opts, user|
  if post.is_first_post? && opts[:is_ticket]
    topic = Topic.find(post.topic_id)

    guardian = Guardian.new(user)
    guardian.ensure_can_create_ticket!(topic)

    topic.custom_fields['is_ticket'] = ActiveModel::Type::Boolean.new.cast(opts[:is_ticket])
    topic.save!
  end
end
