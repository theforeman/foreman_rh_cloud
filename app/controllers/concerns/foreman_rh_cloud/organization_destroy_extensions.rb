module ForemanRhCloud
  module OrganizationDestroyExtensions
    extend ActiveSupport::Concern

    def remove_consumers(organization)
      plan_action(ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob, organization.id) if ForemanRhCloud.with_iop_smart_proxy?
      super
    end
  end
end
