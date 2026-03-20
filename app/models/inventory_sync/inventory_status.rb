module InventorySync
  class InventoryStatus < HostStatus::Status
    DISCONNECT = 0
    SYNC = 1
    USER_OMITTED = 2

    def self.status_name
      N_('Inventory')
    end

    def to_global(_options = {})
      case status
      when DISCONNECT
        ::HostStatus::Global::WARN
      when SYNC
        ::HostStatus::Global::OK
      when USER_OMITTED
        ::HostStatus::Global::OK
      else
        ::HostStatus::Global::WARN
      end
    end

    def to_label
      case status
      when DISCONNECT
        N_('Host was not uploaded to your RH cloud inventory')
      when SYNC
        N_('Included in RH cloud inventory uploads')
      when USER_OMITTED
        N_('Not included in RH cloud inventory due to host parameter')
      end
    end

    def to_status(options = {})
      # Normally this method used to calculate status.
      # In foreman_rh_cloud 'we do things a bit differently around here.'
      # Calculation is done externally in InventorySync::Async::InventoryFullSync, so we simply return the previously calculated status.
      status
    end
  end
end
