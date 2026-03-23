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
        N_('Host is not present on console.redhat.com Inventory service')
      when SYNC
        N_('Host is uploaded and present on console.redhat.com Inventory service')
      when USER_OMITTED
        N_('Host is excluded from upload to console.redhat.com Inventory service due to host parameter')
      end
    end

    def to_status(options = {})
      # Normally this method used to calculate status.
      # In foreman_rh_cloud 'we do things a bit differently around here.'
      # Calculation is done externally in InventorySync::Async::InventoryFullSync, so we simply return the previously calculated status.
      status
    end

    def relevant?(_options = {})
      # Inventory status is not relevant in IoP mode since we use single-host reports
      # that don't sync with the cloud inventory service
      !ForemanRhCloud.with_iop_smart_proxy?
    end
  end
end
