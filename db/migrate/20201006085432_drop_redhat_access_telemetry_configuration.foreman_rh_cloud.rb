class DropRedhatAccessTelemetryConfiguration < ActiveRecord::Migration[5.0]
  def up
    drop_table :redhat_access_telemetry_configurations if table_exists? :redhat_access_telemetry_configurations
  end

  def down
    create_table :redhat_access_telemetry_configurations unless table_exists? :redhat_access_telemetry_configurations
  end
end
