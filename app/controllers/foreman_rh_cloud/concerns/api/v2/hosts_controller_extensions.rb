module ForemanRhCloud
  module Concerns
    module Api
      module V2
        module HostsControllerExtensions
          extend ActiveSupport::Concern

          included do
            def find_resource
              insights_host = ::Katello::Host::SubscriptionFacet.find_by(uuid: params[:id])&.host
              if insights_host.present?
                Rails.logger.debug "ForemanRhCloud host found by subscription uuid: #{params[:id]}"
              end
              @host = insights_host || super
              @host
            end
          end
        end
      end
    end
  end
end
