class TicketsEnabledValidator
  def initialize(opts = {})
    @opts = opts
  end

  def valid_value?(val)
    if ActiveModel::Type::Boolean.new.cast(val)
      SiteSetting.tagging_enabled
    else
      true
    end
  end

  def error_message
    I18n.t('site_settings.errors.tickets_enabled_requires_tagging')
  end
end
