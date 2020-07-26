module InventorySync
  class InventoryStatus < HostStatus::Status
    DISCONNECT = 0
    SYNC = 1

    def self.status_name
      N_('Inventory')
    end

    def to_label
      case status
        when DISCONNECT
          N_('Host was not uploaded to your RH cloud inventory')
        when SYNC
          N_('Successfully uploaded to your RH cloud inventory')
      end
    end
  end
end
