class CreateRedhatAccessTelemetryConfiguration < ActiveRecord::Migration[6.0]
  def up
    return if table_exists? :redhat_access_telemetry_configurations

    create_table :redhat_access_telemetry_configurations do |t|
      t.string :portal_user
      t.string :portal_password
      t.boolean :enable_telemetry
      t.integer :organization_id
      t.string :email

      t.timestamps
    end
    add_index :redhat_access_telemetry_configurations, :organization_id, :name => 'ratc_organization_id'
  end

  def down
    drop_table :redhat_access_telemetry_configurations if table_exists? :redhat_access_telemetry_configurations
  end
end
