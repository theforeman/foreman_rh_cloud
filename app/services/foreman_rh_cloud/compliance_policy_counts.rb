module ForemanRhCloud
  class CompliancePolicyCounts
    include CertAuth

    PAGE_LIMIT = 100

    def self.fetch(user:, organization:, location:)
      new(user, organization, location).fetch
    end

    def initialize(user, organization, location)
      @user = user
      @organization = organization
      @location = location
    end

    def fetch
      unless @organization
        raise ScopedSearch::QueryNotSupported.new(
          _('Select an organization to search by compliance policy count.')
        )
      end

      TagsAuth.new(@user, @organization, @location, logger).update_tag

      counts = {}
      first_page = fetch_page(0)
      record_counts(counts, first_page)

      extra_pages(first_page).times do |index|
        page = fetch_page(PAGE_LIMIT * (index + 1))
        break if Array(page['data']).empty?

        record_counts(counts, page)
      end

      counts
    end

    private

    def record_counts(counts, page)
      Array(page['data']).each do |system|
        next if system['id'].blank?

        counts[system['id']] = Array(system['policies']).size
      end
    end

    def extra_pages(page)
      total = page.dig('meta', 'total').to_i
      return 0 if total <= PAGE_LIMIT

      ((total - PAGE_LIMIT).to_f / PAGE_LIMIT).ceil
    end

    def fetch_page(offset)
      response = execute_cloud_request(
        organization: @organization,
        method: :get,
        url: "#{InsightsCloud.ui_base_url}/api/compliance/v2/systems",
        headers: {
          accept: 'application/vnd.api+json',
          params: {
            limit: PAGE_LIMIT,
            offset: offset,
            tags: TagsAuth.auth_tag_for(@user, @organization, @location),
          },
        }
      )
      JSON.parse(response.body)
    end

    def logger
      Foreman::Logging.logger('app')
    end
  end
end
