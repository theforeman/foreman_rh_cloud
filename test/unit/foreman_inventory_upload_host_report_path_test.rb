require 'test_plugin_helper'

class ForemanInventoryUploadHostReportPathTest < ActiveSupport::TestCase
  test 'inventory_report_location returns blank input unchanged' do
    assert_nil ForemanInventoryUpload.inventory_report_location(nil)
    assert_equal '', ForemanInventoryUpload.inventory_report_location('')
  end

  test 'inventory_report_location uses filesystem path in test/development' do
    Dir.mktmpdir do |tmpdir|
      report = File.join(tmpdir, 'report_for_1.tar.xz')
      FileUtils.touch(report)

      assert_equal File.realpath(report), ForemanInventoryUpload.inventory_report_location(report)
    end
  end

  test 'inventory_report_location describes volume and relative path outside development' do
    Dir.mktmpdir do |tmpdir|
      ForemanInventoryUpload.stubs(:base_folder).returns(File.join(tmpdir, 'red_hat_inventory'))
      FileUtils.mkdir_p(ForemanInventoryUpload.base_folder)
      report = File.join(ForemanInventoryUpload.base_folder, 'uploads', 'report_for_1.tar.xz')
      FileUtils.mkdir_p(File.dirname(report))
      FileUtils.touch(report)

      ForemanInventoryUpload.stubs(:filesystem_report_path_logging?).returns(false)
      old_mountpoint = ENV.delete('FOREMAN_DATA_RUN_MOUNTPOINT')

      begin
        location = ForemanInventoryUpload.inventory_report_location(report)

        assert_includes location, "podman volume 'foreman-data-run'"
        assert_includes location, "relative path 'red_hat_inventory/uploads/report_for_1.tar.xz'"
        assert_includes location, "sudo podman volume inspect --format '{{.Mountpoint}}' foreman-data-run"
      ensure
        ENV['FOREMAN_DATA_RUN_MOUNTPOINT'] = old_mountpoint if old_mountpoint
      end
    end
  end

  test 'inventory_report_location uses path relative to volume root for siblings of inventory dir' do
    Dir.mktmpdir do |tmpdir|
      ForemanInventoryUpload.stubs(:base_folder).returns(File.join(tmpdir, 'red_hat_inventory'))
      FileUtils.mkdir_p(ForemanInventoryUpload.base_folder)
      custom = File.join(tmpdir, 'custom', 'report.tar.xz')
      FileUtils.mkdir_p(File.dirname(custom))
      FileUtils.touch(custom)

      ForemanInventoryUpload.stubs(:filesystem_report_path_logging?).returns(false)
      old_mountpoint = ENV.delete('FOREMAN_DATA_RUN_MOUNTPOINT')

      begin
        location = ForemanInventoryUpload.inventory_report_location(custom)
        assert_includes location, "relative path 'custom/report.tar.xz'"
        refute_includes location, 'red_hat_inventory/report.tar.xz'
      ensure
        ENV['FOREMAN_DATA_RUN_MOUNTPOINT'] = old_mountpoint if old_mountpoint
      end
    end
  end

  test 'inventory_report_location identifies paths outside the volume' do
    Dir.mktmpdir do |inventory_parent|
      Dir.mktmpdir do |other|
        ForemanInventoryUpload.stubs(:base_folder).returns(File.join(inventory_parent, 'red_hat_inventory'))
        FileUtils.mkdir_p(ForemanInventoryUpload.base_folder)
        outside = File.join(other, 'report.tar.xz')
        FileUtils.touch(outside)

        ForemanInventoryUpload.stubs(:filesystem_report_path_logging?).returns(false)
        old_mountpoint = ENV.delete('FOREMAN_DATA_RUN_MOUNTPOINT')

        begin
          location = ForemanInventoryUpload.inventory_report_location(outside)
          assert_includes location, File.realpath(outside)
          assert_includes location, "outside podman volume 'foreman-data-run'"
          refute_includes location, 'red_hat_inventory/report.tar.xz'
        ensure
          ENV['FOREMAN_DATA_RUN_MOUNTPOINT'] = old_mountpoint if old_mountpoint
        end
      end
    end
  end

  test 'inventory_report_location uses FOREMAN_DATA_RUN_MOUNTPOINT when set' do
    Dir.mktmpdir do |tmpdir|
      ForemanInventoryUpload.stubs(:base_folder).returns(File.join(tmpdir, 'red_hat_inventory'))
      FileUtils.mkdir_p(ForemanInventoryUpload.base_folder)
      report = File.join(ForemanInventoryUpload.base_folder, 'generated_reports', 'report_for_1.tar.xz')
      FileUtils.mkdir_p(File.dirname(report))
      FileUtils.touch(report)

      old_mountpoint = ENV['FOREMAN_DATA_RUN_MOUNTPOINT']
      ENV['FOREMAN_DATA_RUN_MOUNTPOINT'] = '/var/lib/containers/storage/volumes/foreman-data-run/_data'
      begin
        ForemanInventoryUpload.stubs(:filesystem_report_path_logging?).returns(false)
        location = ForemanInventoryUpload.inventory_report_location(report)
        assert_equal(
          '/var/lib/containers/storage/volumes/foreman-data-run/_data/red_hat_inventory/generated_reports/report_for_1.tar.xz',
          location
        )
      ensure
        if old_mountpoint
          ENV['FOREMAN_DATA_RUN_MOUNTPOINT'] = old_mountpoint
        else
          ENV.delete('FOREMAN_DATA_RUN_MOUNTPOINT')
        end
      end
    end
  end
end
