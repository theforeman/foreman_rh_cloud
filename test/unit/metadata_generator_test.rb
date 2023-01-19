require 'test_plugin_helper'

class MetadataGeneratorTest < ActiveSupport::TestCase
  setup do
  end

  test 'generates an empty report' do
    generator = ForemanInventoryUpload::Generators::Metadata.new

    json_str = generator.render do
    end
    actual = JSON.parse(json_str.join("\n"))
    puts actual

    assert_not_nil actual['report_id']
    assert_equal 'Satellite', actual['source']
    assert_not_nil (actual_metadata = actual['source_metadata'])
    assert_equal ForemanRhCloud::VERSION, actual_metadata['foreman_rh_cloud_version']
    assert_equal({}, actual['report_slices'])
  end

  test 'generates a report for a single slice' do
    generator = ForemanInventoryUpload::Generators::Metadata.new

    json_str = generator.render do |gen|
      gen.add_slice('test_123', 1, true)
      gen.add_slice('test_1234', 2, false)
      gen.add_slice('test_12345', 3, false)
    end

    actual = JSON.parse(json_str.join("\n"))

    assert_not_nil actual['report_id']
    assert_equal 'Satellite', actual['source']
    assert_not_nil(slices = actual['report_slices'])
    assert_not_nil(slice = slices['test_123'])
    assert_equal 1, slice['number_hosts']
    assert_not_nil(slice = slices['test_1234'])
    assert_equal 2, slice['number_hosts']
    assert_not_nil(slice = slices['test_12345'])
    assert_equal 3, slice['number_hosts']
  end
end
