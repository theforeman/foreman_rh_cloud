# frozen_string_literal: true

class AddMissingHostsTable < ActiveRecord::Migration[6.1]
  def change
    create_table :insights_missing_hosts do |t|
      t.integer :organization_id
      t.string :name
      t.string :insights_id
      t.string :rhsm_id
      t.string :ip_address
    end
  end
end
