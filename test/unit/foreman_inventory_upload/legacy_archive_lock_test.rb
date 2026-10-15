require 'test_plugin_helper'

class LegacyArchiveLockTest < ActiveSupport::TestCase
  test 'exclusive lock is released even after a failed cleanup' do
    connection = mock
    connection.expects(:execute).with('SELECT pg_advisory_lock(4608579, 1)')
    connection.expects(:execute).with('SELECT pg_advisory_unlock(4608579, 1)')
    stub_connection_pool(connection)
    assert_raises(IOError) { ForemanInventoryUpload::LegacyArchiveLock.synchronize { raise IOError } }
  end

  test 'legacy readers and writers use the matching shared lock' do
    connection = mock
    connection.expects(:execute).with('SELECT pg_advisory_lock_shared(4608579, 1)')
    connection.expects(:execute).with('SELECT pg_advisory_unlock_shared(4608579, 1)')
    stub_connection_pool(connection)
    result = ForemanInventoryUpload::LegacyArchiveLock.synchronize(shared: true) { :finished }
    assert_equal :finished, result
  end

  private

  def stub_connection_pool(connection)
    pool = Object.new
    pool.define_singleton_method(:with_connection) { |&block| block.call(connection) }
    ActiveRecord::Base.stubs(:connection_pool).returns(pool)
  end
end
