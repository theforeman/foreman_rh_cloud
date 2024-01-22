require 'io/console'

namespace :rh_cloud do |args|
  desc 'Register Satellite Organization with Hybrid Cloud API. \
        Specify org_id=x replace your organization ID with x. \
        Specify SATELLITE_RH_CLOUD_URL=https://x with the Hybrid Cloud endpoint you are connecting to.'
  task hybridcloud_register: [:environment] do
    include ::ForemanRhCloud::CertAuth
    include ::InsightsCloud::CandlepinCache

    def logger
      @logger ||= Logger.new(STDOUT)
    end

    def registrations_url
      logger.warn("Custom url is not set, using the default one: #{ForemanRhCloud.base_url}") if ENV['SATELLITE_RH_CLOUD_URL'].empty?
      ForemanRhCloud.base_url + '/api/identity/certificate/registrations'
    end

    if ENV['org_id'].nil?
      logger.error('ERROR: org_id needs to be specified.')
      exit(1)
    end

    @organization = Organization.find_by(id: ENV['org_id'].to_i) # saw this coming in as a string, so making sure it gets passed as an integer.
    @uid = cp_owner_id(@organization)
    @hostname = ForemanRhCloud.foreman_host_name
    logger.error('Organization provided does not have a manifest imported.') + exit(1) if @uid.nil?

    puts 'Paste your token, output will be hidden.'
    @token = STDIN.noecho(&:gets).chomp
    logger.error('Token was not entered.') + exit(1) if @token.empty?

    def headers
      {
        Authorization: "Bearer #{@token}",
      }
    end

    def payload
      {
        "uid": @uid,
        "display_name": "#{@hostname}+#{@organization.label}",
      }
    end

    def method
      :post
    end

    begin
      response = execute_cloud_request(
        organization: @organization,
        method: method,
        url: registrations_url,
        headers: headers,
        payload: payload.to_json
      )
      logger.debug(response)
    rescue StandardError => ex
      logger.error(ex)
    end
  end
end
