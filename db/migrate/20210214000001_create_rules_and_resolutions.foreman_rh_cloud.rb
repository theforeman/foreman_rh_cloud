class CreateRulesAndResolutions < ActiveRecord::Migration[5.2]
  def change
    create_table :insights_rules do |t|
      t.string :rule_id
      t.string :description
      t.string :category_name
      t.string :impact_name
      t.string :summary
      t.string :generic
      t.string :reason
      t.integer :total_risk
      t.boolean :reboot_required
      t.string :more_info
      t.integer :rating
    end

    create_table :insights_resolutions do |t|
      t.string :rule_id
      t.integer :system_type
      t.string :resolution
      t.boolean :has_playbook
    end
  end
end
