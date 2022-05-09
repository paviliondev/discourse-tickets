class Tickets::TicketSerializer < ::ApplicationSerializer
  attributes :title, :url, :tags, :status, :priority, :reason, :assigned

  def title
    object.title
  end

  def url
    object.url
  end

  def tags
    tag_names - [status_tag, priority_tag, reason_tag]
  end

  def status
    status_tag
  end

  def priority
    priority_tag
  end

  def reason
    reason_tag
  end

  def assigned
    ::BasicUserSerializer.new(object.assigned_to, root: 'user').as_json
  end

  def include_assigned?
    object.respond_to?(:assigned_to) && object.assigned_to.present?
  end

  private

  def status_tag
    @status_tag ||= ::Tickets::Tag.for_type(tag_names, ::Tickets::Tag::STATUS)
  end

  def priority_tag
    @priority_tag ||= ::Tickets::Tag.for_type(tag_names, ::Tickets::Tag::PRIORITY)
  end

  def reason_tag
    @reason_tag ||= ::Tickets::Tag.for_type(tag_names, ::Tickets::Tag::REASON)
  end

  def tag_names
    @tag_names ||= object.tags.map(&:name)
  end
end
