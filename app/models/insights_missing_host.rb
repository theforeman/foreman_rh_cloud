class InsightsMissingHost < ApplicationRecord
  belongs_to :organization

  scoped_search on: [:name, :insights_id, :rhsm_id, :ip_address]
  validates :organization_id, presence: true
  validates :name, presence: true
end
