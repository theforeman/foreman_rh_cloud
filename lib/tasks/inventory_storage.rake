namespace :rh_cloud_inventory do
  namespace :storage do
    allowed_apply = ['true', 'false'].freeze
    [:migrate, :cleanup].each do |operation|
      desc "Preview inventory archive #{operation} (APPLY=true to apply)"
      task operation => :environment do
        require 'foreman_inventory_upload/legacy_report_migration'
        apply = ENV.fetch('APPLY', 'false')
        abort 'APPLY must be true or false' unless allowed_apply.include?(apply)
        counts = User.as_anonymous_admin do
          ForemanInventoryUpload::LegacyReportMigration.new(
            apply: apply == 'true', cleanup: operation == :cleanup,
            drained: ENV['CONFIRM_DRAINED'] == 'true'
          ).run
        end
        abort 'Some archives could not be processed; inspect the output and retry' if counts[:failed].positive?
      end
    end
  end
end
