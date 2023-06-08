module ForemanInventoryUpload
  module Async
    class RemoveInsightsHostsJob < ::Actions::EntryAction
      include ForemanRhCloud::CertAuth

      def plan(search_term, organization_id)
        plan_self(search_term: search_term, organization_id: organization_id)
      end

      def run
        logger.debug("Attempting to remove hosts by search term: #{search_term}")

        host_uuids = InsightsMissingHost.search_for(search_term).pluck(:insights_id)

        page_number = 1
        while (current_page = host_uuids.paginate(page: page_number, per_page: page_size)).present?
          logger.debug("Removing #{(page_number - 1) * page_size} - #{page_number * page_size}/#{current_page.total_entries} hosts: #{current_page.join(',')}")
          response = delete_page(current_page, organization)
          # write the response in case we want to track it later
          output["response_page#{page_number}"] = response.body

          # remove host records that reported success after deletion
          if response.code >= 200 && response.code < 300
            remove_host_records(current_page)
          else
            error! "Cloud responded with code: #{response.code}"
          end

          page_number += 1
        end
      end

      def logger
        Foreman::Logging.logger('background')
      end

      def search_term
        input[:search_term]
      end

      def organization
        @organization ||= Organization.find_by(id: input[:organization_id])
      end

      def delete_page(host_uuids, organization)
        execute_cloud_request(
          organization: organization,
          method: :delete,
          url: ForemanInventoryUpload.hosts_by_ids_url(host_uuids),
          headers: {
            content_type: :json,
          }
        )
      rescue RestClient::ExceptionWithResponse => error_response
        error_response.response
      end

      def remove_host_records(uuids)
        InsightsMissingHost.where(insights_id: uuids).delete_all
      end

      def page_size
        # the_most_conservative_url_size_limit(2083) / uri_size(36) with some spares for the domain name
        40
      end
    end
  end
end
