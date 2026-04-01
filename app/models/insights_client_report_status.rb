class InsightsClientReportStatus < HostStatus::Status
  REPORT_INTERVAL = 48.hours

  REPORTING             = 0
  NO_REPORT             = 1
  USER_OMITTED          = 2

  scope :stale, -> { where.not(status: USER_OMITTED).where.not(reported_at: (Time.now - REPORT_INTERVAL)..Time.now) }
  scope :reporting, -> { where(status: REPORTING) }

  def self.status_name
    N_('Insights')
  end

  def to_label(_options = {})
    case status
    when REPORTING
      N_('Reporting')
    when NO_REPORT
      N_('Not reporting')
    when USER_OMITTED
      N_('Not reporting because host_registration_insights parameter value is false')
    end
  end

  def to_global(_options = {})
    case status
    when REPORTING
      ::HostStatus::Global::OK
    when NO_REPORT
      ::HostStatus::Global::ERROR
    when USER_OMITTED
      ::HostStatus::Global::OK
    end
  end

  def to_status
    excluded_by_host_param =
      ::Foreman::Cast.to_bool(host.host_param('host_registration_insights')) == false
    return USER_OMITTED if excluded_by_host_param
    in_interval? ? REPORTING : NO_REPORT
  end

  # prevent creation of the status on global refresh, but show it if the record already exists
  def relevant?(_options = {})
    persisted?
  end

  private

  def in_interval?
    return false unless reported_at
    (Time.now.utc - reported_at).to_i < REPORT_INTERVAL.to_i
  end
end
