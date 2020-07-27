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
          host_id = host_id(fqdn)
          if host_id
            touched << host_id
            {
              host_id: host_id,
              status: InventorySync::InventoryStatus::SYNC,
              reported_at: DateTime.current,
            }
          end
        end
      end

      def touched
        @touched ||= []
      end

      def host_id(fqdn)
        hosts[fqdn]
      end

      def hosts
        @hosts ||= Hash[
          Host.where(name: @fqdns).pluck(:name, :id)
        ]
      end

      def percentage
        return 100 unless @per_page * @page < @total 
        @per_page * @page * 100 / @total 
      end

      def last?
        @total <= @per_page * @page
      end
    end
  end
end
