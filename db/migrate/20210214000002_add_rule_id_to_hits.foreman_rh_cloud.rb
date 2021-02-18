class AddRuleIdToHits < ActiveRecord::Migration[5.2]
  def change
    add_column :insights_hits, :rule_id, :string
  end
end
