class CreateForemanInventoryUploadReports < ActiveRecord::Migration[7.0]
  def change
    create_table :foreman_inventory_upload_reports do |t|
      t.references :organization, null: false, index: true
      t.string :filename, null: false
      t.integer :state, null: false, default: 0
      t.datetime :uploaded_at
      t.string :sha256, null: false
      t.string :execution_plan_uuid
      t.text :legacy_path
      t.datetime :legacy_cleaned_at
      t.timestamps
    end

    add_foreign_key :foreman_inventory_upload_reports,
      :taxonomies,
      column: :organization_id
    add_index :foreman_inventory_upload_reports, [:legacy_path, :sha256], unique: true,
      name: :index_inventory_reports_on_legacy_source
    add_index :foreman_inventory_upload_reports,
      [:organization_id, :created_at],
      name: :index_inventory_reports_on_organization_and_created_at
  end
end
