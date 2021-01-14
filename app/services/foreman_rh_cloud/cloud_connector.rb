require 'securerandom'

module ForemanRhCloud
  class CloudConnector

    CLOUD_CONNECTOR_USER = 'cloud_connector_user'.freeze
    CLOUD_CONNECTOR_TOKEN_NAME = 'Cloud connector access token'.freeze
    CLOUD_CONNECTOR_FEATURE = 'ansible_configure_cloud_connector'.freeze

    def install
      user = service_user
      token_value = personal_access_token(user)

      composer = ::JobInvocationComposer.for_feature(
        CLOUD_CONNECTOR_FEATURE,
        [foreman_host.id],
        {:satellite_user => service_user.login, :satellite_password => token_value}
      )
      composer.trigger!
      composer.job_invocation
    end

    def latest_job
      feature_id = RemoteExecutionFeature.find_by_label(CLOUD_CONNECTOR_FEATURE).id
      JobInvocation.where(:remote_execution_feature_id => feature_id).first
    end

    def personal_access_token(user)
      access_token = PersonalAccessToken.find_by_name(CLOUD_CONNECTOR_TOKEN_NAME)

      unless access_token.nil?
        access_token.destroy!
      end

      personal_access_token = PersonalAccessToken.new(:name => CLOUD_CONNECTOR_TOKEN_NAME, :user => user)
      token_value = personal_access_token.generate_token
      personal_access_token.save!

      token_value
    end

    def service_user
      user = User.find_by_login(CLOUD_CONNECTOR_USER)

      if user.nil?
        user = User.create!(
          :login => CLOUD_CONNECTOR_USER,
          :password => SecureRandom.base64(255),
          :description => "This is a service user used by cloud connector to talk to the Satellite API",
          :auth_source => AuthSourceInternal.first,
          :admin => true
        )
      end

      user
    end

    def foreman_host
      ::Host.friendly.find(::SmartProxy.default_capsule.name)
    end

  end
end
