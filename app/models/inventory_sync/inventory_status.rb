module InventorySync
  class InventoryStatus < HostStatus::Status
    DISCONNECT = 0
    SYNC = 1

    def self.status_name
      N_('Inventory')
    end

    def to_global(_options = {})
      case status
      when DISCONNECT
        ::HostStatus::Global::WARN
      when SYNC
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
        N_('Successfully uploaded to your RH cloud inventory')
      end
    end

    def to_status(options = {})
      # this method used to calculate status.
      # Since the calculation is done externally we should return the previously calculated status
      status
    end
  end
end
