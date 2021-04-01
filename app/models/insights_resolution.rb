class InsightsResolution < ApplicationRecord
  belongs_to :rule, class_name: 'InsightsRule', primary_key: 'rule_id', inverse_of: :resolutions
end
