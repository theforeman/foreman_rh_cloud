require 'test_plugin_helper'

class InventoryArchiveReportTest < ActiveSupport::TestCase
  let(:organization) { FactoryBot.create(:organization) }

  test 'stores an inventory archive with Active Storage' do
    report = ForemanInventoryUpload::Report.create!(
      organization: organization,
      filename: 'inventory.tar.xz',
      sha256: Digest::SHA256.hexdigest('inventory')
    )

    report.archive.attach(
      io: StringIO.new('inventory'),
      filename: report.filename,
      content_type: 'application/x-xz'
    )

    assert report.archive.attached?
    assert_equal 'inventory', report.archive.download
    assert_predicate report, :generated?
  end

  test 'orders the newest report first' do
    older = ForemanInventoryUpload::Report.create!(
      organization: organization,
      filename: 'older.tar.xz',
      sha256: Digest::SHA256.hexdigest('older'),
      created_at: 1.hour.ago
    )
    newer = ForemanInventoryUpload::Report.create!(
      organization: organization,
      filename: 'newer.tar.xz',
      sha256: Digest::SHA256.hexdigest('newer')
    )

    assert_equal [newer, older], ForemanInventoryUpload::Report.latest_first.to_a
  end

  test 'retention protects resumable tasks and keeps the latest report' do
    older = ForemanInventoryUpload::Report.create!(organization: organization, filename: 'same.tar.xz', sha256: 'old', created_at: 1.hour.ago, execution_plan_uuid: 'old-plan')
    newer = ForemanInventoryUpload::Report.create!(organization: organization, filename: 'same.tar.xz', sha256: 'new', execution_plan_uuid: 'new-plan')
    tasks = stub
    tasks.stubs(:exists?).returns(false).then.returns(true)
    ForemanTasks::Task.stubs(:where).with(external_id: 'old-plan', state: 'stopped').returns(tasks)

    ForemanInventoryUpload::Report.prune_completed!(organization.id, older.filename)
    assert ForemanInventoryUpload::Report.exists?(older.id)
    ForemanInventoryUpload::Report.prune_completed!(organization.id, older.filename)
    refute ForemanInventoryUpload::Report.exists?(older.id)
    assert ForemanInventoryUpload::Report.exists?(newer.id)
  end

  test 'cleaned legacy imports can be pruned without an invented task owner' do
    older = ForemanInventoryUpload::Report.create!(organization: organization, filename: 'same.tar.xz', sha256: 'old', created_at: 1.hour.ago, legacy_path: '/legacy/report.tar.xz', legacy_cleaned_at: 1.minute.ago)
    newer = ForemanInventoryUpload::Report.create!(organization: organization, filename: 'same.tar.xz', sha256: 'new')
    ForemanInventoryUpload::Report.prune_completed!(organization.id, older.filename)
    refute ForemanInventoryUpload::Report.exists?(older.id)
    assert ForemanInventoryUpload::Report.exists?(newer.id)
  end
end
