require 'test_plugin_helper'
require 'foreman_inventory_upload/legacy_report_migration'

class LegacyReportMigrationTest < ActiveSupport::TestCase
  include FolderIsolation

  setup do
    @organization = FactoryBot.create(:organization)
    @path = File.join(@tmpdir, 'generated_reports', ForemanInventoryUpload.facts_archive_name(@organization.id))
    FileUtils.mkdir_p(File.dirname(@path))
    File.binwrite(@path, 'original inventory')
    @output = StringIO.new
  end

  def migrate(**options)
    ForemanInventoryUpload::LegacyReportMigration.new(output: @output, **options).run
  end

  test 'preview writes neither attachments nor source files' do
    ForemanInventoryUpload::Report.expects(:from_file!).never
    assert_equal 1, migrate[:eligible]
    assert_equal 'original inventory', File.binread(@path)
  end

  test 'copy is verified, repeatable and never uploads to Red Hat' do
    ForemanTasks.expects(:async_task).never
    assert_equal 1, migrate(apply: true)[:copied]
    report = ForemanInventoryUpload::Report.find_by!(legacy_path: @path)
    assert_equal 'original inventory', report.archive.download
    assert_nil report.uploaded_at
    assert_equal 1, migrate(apply: true)[:skipped]
    assert File.exist?(@path)
  end

  test 'cleanup requires an explicit maintenance assertion' do
    migrate(apply: true)
    assert_raises(RuntimeError) { migrate(apply: true, cleanup: true) }
    assert File.exist?(@path)
  end

  test 'cleanup preview retains originals and apply removes only a verified copy' do
    migrate(apply: true)
    assert_equal 1, migrate(cleanup: true)[:eligible]
    assert File.exist?(@path)
    assert_equal 1, migrate(apply: true, cleanup: true, drained: true)[:cleaned]
    refute File.exist?(@path)
    assert_equal 'original inventory', ForemanInventoryUpload::Report.find_by!(legacy_path: @path).archive.download
  end

  test 'missing or corrupt attachment leaves its source untouched' do
    migrate(apply: true)
    blob = ForemanInventoryUpload::Report.find_by!(legacy_path: @path).archive.blob
    blob.service.upload(blob.key, StringIO.new('corrupt'))
    assert_equal 1, migrate(apply: true)[:failed]
    assert_equal 1, migrate(apply: true, cleanup: true, drained: true)[:failed]
    assert_equal 'original inventory', File.binread(@path)
  end

  test 'changed sources and symlinks cannot be cleaned up' do
    migrate(apply: true)
    File.binwrite(@path, 'newer inventory')
    assert_equal 1, migrate(apply: true, cleanup: true, drained: true)[:failed]
    File.unlink(@path)
    File.symlink('/does-not-exist', @path)
    assert_equal 1, migrate(apply: true)[:failed]
    assert File.symlink?(@path)
  end

  test 'active or paused inventory tasks block destructive cleanup' do
    migrate(apply: true)
    tasks = stub
    ForemanTasks::Task.expects(:where).with('label LIKE ?', 'ForemanInventoryUpload::Async::%').returns(tasks)
    tasks.stubs(:where).returns(tasks)
    tasks.stubs(:not).returns(tasks)
    tasks.stubs(:exists?).returns(true)
    assert_raises(RuntimeError) { migrate(apply: true, cleanup: true, drained: true) }
    assert File.exist?(@path)
  end

  test 'a source-change rollback removes only the new uploaded object' do
    migration = ForemanInventoryUpload::LegacyReportMigration.new(apply: true, output: @output)
    migration.stubs(:fingerprint).returns([1]).then.returns([2])
    ActiveStorage::Blob.service.expects(:delete).at_least_once
    before = ActiveStorage::Blob.count
    assert_equal 1, migration.run[:failed]
    assert_equal before, ActiveStorage::Blob.count
    refute ForemanInventoryUpload::Report.exists?(legacy_path: @path)
    assert_equal 'original inventory', File.binread(@path)
  end

  test 'interrupted cleanup reconciles a missing source only after checking the attachment' do
    migrate(apply: true)
    report = ForemanInventoryUpload::Report.find_by!(legacy_path: @path)
    File.unlink(@path)
    assert_nil report.legacy_cleaned_at
    assert_equal 1, migrate(apply: true, cleanup: true, drained: true)[:cleaned]
    assert_not_nil report.reload.legacy_cleaned_at
    assert_equal 'original inventory', report.archive.download
  end
end
