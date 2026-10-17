module ForemanInventoryUpload
  # Session-level PostgreSQL locks coordinate legacy filesystem users across
  # web/worker processes. A lost connection also releases its lock.
  module LegacyArchiveLock
    def self.synchronize(shared: false)
      suffix = shared ? '_shared' : ''
      ActiveRecord::Base.connection_pool.with_connection do |connection|
        acquired = false
        begin
          connection.execute("SELECT pg_advisory_lock#{suffix}(4608579, 1)")
          acquired = true
          yield
        ensure
          connection.execute("SELECT pg_advisory_unlock#{suffix}(4608579, 1)") if acquired
        end
      end
    end
  end
end
