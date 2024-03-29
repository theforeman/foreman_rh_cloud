class InsightsRule < ApplicationRecord
  has_many :resolutions, class_name: 'InsightsResolution', dependent: :destroy, foreign_key: 'rule_id', primary_key: 'rule_id', inverse_of: :rule

  has_many :hits, class_name: 'InsightsHit', foreign_key: 'rule_id', primary_key: 'rule_id', inverse_of: :rule
end
