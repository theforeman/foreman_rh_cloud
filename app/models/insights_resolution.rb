class InsightsResolution < ApplicationRecord
  belongs_to :rule, class_name: 'InsightsRule', foreign_key: 'rule_id', primary_key: 'rule_id', inverse_of: :resolutions
end
