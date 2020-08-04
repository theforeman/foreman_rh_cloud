module InventorySync
  module Async
    class HostResult
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
        end.compact
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
        ratio = @per_page * @page * 1.0 / @total * 100
        (ratio > 100) ? 100 : ratio.truncate(2)
      end

      def last?
        @total <= @per_page * @page
      end
    end
  end
end
