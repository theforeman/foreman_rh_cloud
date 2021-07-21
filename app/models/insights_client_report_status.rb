class InsightsClientReportStatus < HostStatus::Status
  REPORT_INTERVAL = 48.hours

  REPORTING             = 0
  NO_REPORT             = 1

  scope :stale, -> { where.not(reported_at: (Time.now - REPORT_INTERVAL)..Time.now) }
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
    end
  end

  def to_global(_options = {})
    case status
      when REPORTING
        ::HostStatus::Global::OK
      when NO_REPORT
        ::HostStatus::Global::ERROR
    end
  end

  def to_status
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
