module TicketsGuardian
  def can_create_ticket?(topic)
    is_staff? && SiteSetting.tickets_enabled
  end
end

require_dependency 'guardian'
class ::Guardian
  include TicketsGuardian
end
