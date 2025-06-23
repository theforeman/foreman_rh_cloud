require 'io/console'
require 'uri'

def logger
  @logger ||= Logger.new(STDOUT)
end

namespace :rh_cloud do
  desc 'Register Satellite Organization with Hybrid Cloud API.'
  # This task registers the Satellite Organization with the Hybrid Cloud API.
  # It requires the user to input their organization ID, Insights URL, and token.
  # The task will then send a POST request to the Hybrid Cloud API to register the organization.
  # The response will be logged, and any errors will be caught and logged as well.
  # The task will exit with an error message if the organization does not have a manifest imported or if the token is not entered.
  # The task will also log a warning if the custom URL is not set and the default one is used.
  task hybridcloud_register: [:environment] do
    include ::ForemanRhCloud::CertAuth
    include ::InsightsCloud::CandlepinCache

    def default_registrations_url
      URI.join(ForemanRhCloud.base_url, '/api/identity/certificate/registrations').to_s
    end

    # Helper method to get the registrations URL, with a warning for default usage
    def registrations_url(custom_url)
      if custom_url.empty?
        logger.warn("Custom url is not set, using the default one: #{default_registrations_url}")
        default_registrations_url
      else
        if URI(custom_url).scheme.nil?
          logger.warn("Custom URL lacks a scheme; prepending https:// prefix.")
          custom_url = "https://" + custom_url
        end
        custom_url
      end
    end

    def get_organization(user_org_id)
      maybe_organization = Organization.find_by(id: user_org_id)
      if maybe_organization.nil?
        logger.error("Organization with ID '#{user_org_id}' not found.")
        exit(1)
      end
      maybe_organization
    end

    def get_uid(organization)
      maybe_uid = cp_owner_id(organization)
      if maybe_uid.nil?
        logger.error("Organization '#{organization}' does not have a manifest imported.")
        exit(1)
      end
      maybe_uid
    end

    # --- Input Collection ---
    puts "Paste in your organization ID, this can be retrieved with the command: hammer organization list"
    loop do
      input = STDIN.gets.chomp
      if input.match?(/^\d+$/) # Checks if input consists only of digits
        @user_org_id = input.to_i
        break
      else
        puts "Invalid input. Please enter a numeric organization ID."
      end
    end

    puts "\n" + "-" * 50 + "\n\n"
    puts "Paste in your custom Insights URL. If nothing is entered, the default will be used (#{default_registrations_url})."
    insights_user_input = STDIN.gets.chomp

    puts "\n" + "-" * 50 + "\n\n"
    puts 'Paste in your Hybrid Cloud API token, output will be hidden.'
    puts 'This token can be retrieved from the Hybrid Cloud console.'
    token = STDIN.noecho(&:gets).chomp
    if token.empty?
      logger.error('Token was not entered.')
      exit(1)
    end

    # --- Data Preparation ---

    organization = get_organization(@user_org_id)
    uid = get_uid(organization)
    hostname = ForemanRhCloud.foreman_host_name
    insights_url = registrations_url(insights_user_input)

    # --- API Request ---

    headers = {
      Authorization: "Bearer #{token}",
    }

    payload = {
      'uid': uid,
      "display_name": "#{hostname}+#{organization.label}",
    }

    begin
      response = execute_cloud_request(
        organization: organization,
        method: :post,
        url: insights_url,
        headers: headers,
        payload: payload.to_json
      )
      logger.debug("Cloud request completed: status=#{response.code}, body_preview=#{response.body&.slice(0, 200)}")
    rescue RestClient::Unauthorized => _ex
      # Add a more specific rescue for 401 Unauthorized errors
      logger.error('Registration failed: Your token is invalid or unauthorized. Please check your token and try again.')
      # Optionally, you can still log the full debug info if helpful for advanced troubleshooting
      # logger.debug(ex.backtrace.join("\n"))
      exit(1)
    rescue RestClient::ExceptionWithResponse => ex
      # This catches any RestClient exception that has a response (like 400, 403, 404, 500, etc.)
      status_code = begin
        ex.response.code
      rescue StandardError
        "unknown"
      end
      logger.error("Registration failed with HTTP status #{status_code}: #{ex.message}")
      logger.debug("Response body (if available): #{ex.response.body}")
      exit(1)
    rescue StandardError => ex
      # This is the catch-all for any other unexpected errors
      logger.error("An unexpected error occurred during registration: #{ex.message}")
      exit(1)
    end

    logger.info("Satellite Organization '#{organization.label}' (ID: #{@user_org_id}) successfully registered.")
  end
end
