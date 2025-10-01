module ForemanInventoryUpload
  module Async
    class SingleHostReportJob < HostInventoryReportJob
      def plan(base_folder, organization_id, host_id)
        input[:host_id] = host_id
        super(base_folder, organization_id, "id=#{input[:host_id]}")
      end

      def hostname(host_id)
        host = ::Host.find_by(id: host_id)
        host&.name
      end

      def humanized_name
        hostname_result = hostname(input[:host_id])
        hostname_result.present? ? format(_("Single-host report job for host %s"), hostname_result) : _("Single-host report job")
      end
    end
  end
end
