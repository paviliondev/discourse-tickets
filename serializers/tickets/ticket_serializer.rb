class Tickets::TicketSerializer < ::ApplicationSerializer
  attributes :title, :url, :status, :priority, :reason, :assigned

  def title
    object.title
  end

  def url
    object.url
  end

  def status
    ::Tickets::Tag.for_type(tags, ::Tickets::Tag::STATUS)
  end

  def priority
    ::Tickets::Tag.for_type(tags, ::Tickets::Tag::PRIORITY)
  end

  def reason
    ::Tickets::Tag.for_type(tags, ::Tickets::Tag::REASON)
  end

  def tags
    @tags ||= object.tags.map { |t| t.name }
  end

  def assigned
    ::BasicUserSerializer.new(object.assigned_to_user, root: 'user').as_json
  end

  def include_assigned?
    object.respond_to?(:assigned_to_user) && object.assigned_to_user.present?
  end
end
