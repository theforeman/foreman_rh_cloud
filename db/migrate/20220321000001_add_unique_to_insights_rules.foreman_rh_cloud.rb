class AddUniqueToInsightsRules < ActiveRecord::Migration[5.2]
  def change
    begin
      # remove old index
      remove_index :insights_rules, [:rule_id]
    rescue ArgumentError
      # noop, if the index is not there, it's OK.
    end

    # add unique constraint
    add_index :insights_rules, [:rule_id], unique: true
  end
end
