require 'foreman_rh_cloud/engine.rb'
require 'cgi'
require 'uri'

module ForemanRhCloud
  def self.on_premise_url
    return unless ForemanRhCloud.with_iop_smart_proxy?
    ForemanRhCloud.iop_smart_proxy&.url
  end

  def self.env_or_on_premise_url(env_var_name)
    on_premise_url || ENV[env_var_name]
  end

  def self.base_url
    # for testing set ENV to 'https://ci.cloud.redhat.com'
    env_or_on_premise_url('SATELLITE_RH_CLOUD_URL') || 'https://cloud.redhat.com'
  end

  def self.cert_base_url
    env_or_on_premise_url('SATELLITE_CERT_RH_CLOUD_URL') || 'https://cert.cloud.redhat.com'
  end

  # Lightspeed/CLA is cloud-only. Use the cloud URL only when the admin
  # enables force_cla_connection; otherwise follow cert_base_url (IoP when IoP is on).
  def self.cloud_cert_base_url
    return cert_base_url unless Setting[:force_cla_connection]

    ENV['SATELLITE_CERT_RH_CLOUD_URL'] || 'https://cert.cloud.redhat.com'
  end

  def self.legacy_insights_url
    env_or_on_premise_url('SATELLITE_LEGACY_INSIGHTS_URL') || 'https://cert-api.access.redhat.com'
  end

  def self.verify_ssl_method
    @verify_ssl_method ||= ENV['SATELLITE_RH_CLOUD_URL'] ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER
  end

  def self.query_limit
    @query_limit ||= ENV['SATELLITE_RH_CLOUD_QUERY_LIMIT'] ? ENV['SATELLITE_RH_CLOUD_QUERY_LIMIT'].to_i : 100
  end

  def self.http_proxy_string
    ForemanRhCloud.proxy_setting
  end

  def self.transformed_http_proxy_string
    ForemanRhCloud.transform_scheme(ForemanRhCloud.proxy_setting)
  end

  def self.proxy_setting
    fix_port(proxy_string)
  end

  def self.proxy_string
    return '' if ForemanRhCloud.with_iop_smart_proxy?

    cloud_proxy_string
  end

  def self.cloud_proxy_string
    HttpProxy.default_global_content_proxy&.full_url ||
    ForemanRhCloud.global_foreman_proxy ||
    ''
  end

  def self.transformed_cloud_http_proxy_string
    transform_scheme(fix_port(cloud_proxy_string))
  end

  def self.fix_port(uri_string)
    return '' if uri_string.empty?

    uri = URI(uri_string)
    uri.send(:define_singleton_method, :default_port, -> { nil })

    uri.to_s
  end

  def self.global_foreman_proxy
    Setting[:http_proxy]
  end

  # This method assumes uri_string contains uri-encoded username and p@$$word:
  # http://user:p%40%24%24word@localhost:8888
  def self.transform_scheme(uri_string)
    return unless uri_string
    transformed_uri = URI.parse(uri_string)

    case transformed_uri.scheme
    when "http"
      transformed_uri.scheme = 'proxy'
    when "https"
      transformed_uri.scheme = 'proxys'
    end

    transformed_uri.to_s
  end

  # For testing purposes we can override the default hostname with an environment variable SATELLITE_RH_CLOUD_FOREMAN_HOST
  def self.foreman_host
    return @foreman_host if defined?(@foreman_host)

    fullname = foreman_host_name
    return @foreman_host = nil unless fullname

    # Try fullname first
    host = ::Host.unscoped.friendly.where(name: fullname).first

    # If not found, try shortname
    if host.nil?
      shortname = /(?<shortname>[^\.]*)\.?.*/.match(fullname)[:shortname]
      host = ::Host.unscoped.friendly.where(name: shortname).first
    end

    @foreman_host = host
  end

  def self.foreman_host_name
    ENV['SATELLITE_RH_CLOUD_FOREMAN_HOST'] || marked_foreman_host&.name || foreman_url_hostname
  end

  def self.foreman_url_hostname
    return nil unless Setting[:foreman_url]

    begin
      # Ensure setting is a string to avoid TypeError from URI.parse
      url = Setting[:foreman_url].to_s
      URI.parse(url).host
    rescue URI::InvalidURIError, ArgumentError, TypeError => e
      Rails.logger.warn("Invalid foreman_url setting: #{e.message}")
      nil
    end
  end

  def self.marked_foreman_host
    # Find host with infrastructure_facet.foreman_instance = true
    # Facets use a special mechanism in Foreman, so we query the facet table directly
    return nil unless defined?(HostFacets::InfrastructureFacet)

    facet = HostFacets::InfrastructureFacet.find_by(foreman_instance: true)
    facet&.host
  rescue ActiveRecord::StatementInvalid => e
    # Table might not exist yet during migrations
    Rails.logger.debug("Could not query marked foreman host: #{e.message}")
    nil
  end

  def self.legacy_insights_ca
    "#{ForemanRhCloud::Engine.root}/config/rh_cert-api_chain.pem" unless ForemanRhCloud.with_iop_smart_proxy?
  end

  def self.cloud_url_validator
    @cloud_url_validator ||= Regexp.new(ENV['SATELLITE_RH_CLOUD_VALIDATOR'] || 'redhat.com$')
  end

  def self.requests_delay
    @requests_delay ||= ENV['SATELLITE_RH_CLOUD_REQUESTS_DELAY']
  end
end
