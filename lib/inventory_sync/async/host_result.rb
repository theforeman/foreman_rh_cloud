module InventorySync
  module Async
    class HostResult < ::ApplicationJob
      def initialize(result)
        @total = result['total']
        @count = result['count']
        @page = result['page']
        @per_page = result['per_page']
        @fqdns = result["results"].map { |host| host['fqdn'] }
      end

      def status_hashes
        @fqdns.map do |fqdn|
          if host_id(fqdn)
            {
              host_id: host_id(fqdn),
              status: InventorySync::InventoryStatus::SYNC,
              reported_at: DateTime.current,
            }
          end
        end
      end

      def host_id(fqdn)
        hosts[fqdn]
      end

      def hosts
        @hosts ||= Hash[
          Host.where(name: @fqdns).pluck(:name, :id)
        ]
      end

      def last?
        @total <= @per_page * @page
      end
    end
  end
end
