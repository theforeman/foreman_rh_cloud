module ForemanRhCloud
  module OrganizationDestroyExtensions
    extend ActiveSupport::Concern

    def remove_consumers(organization)
      plan_action(ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob, organization.id)
      super
    end
  end
end
