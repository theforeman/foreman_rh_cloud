class InsightsHit < ApplicationRecord
  include ::Authorizable
  belongs_to :host
  # since the facet is one-to-one association with a host, we can connect
  # through host_id column on both this model and facet.
  belongs_to :insights_facet, foreign_key: 'host_id', primary_key: 'host_id', counter_cache: :hits_count

  has_one :rule, class_name: 'InsightsRule', foreign_key: 'rule_id', primary_key: 'rule_id'

  scope :with_playbook, -> { joins(:rule) }
  scope :for_organizations, ->(organization_ids) { joins(:host).where(hosts: { organization_id: organization_ids}) }

  scoped_search on: :title, complete_value: true
  scoped_search on: :total_risk, complete_value: true
  scoped_search on: :rule_id, complete_value: true, only_explicit: true
  scoped_search relation: :host, on: :name, rename: :hostname, complete_value: true
  scoped_search on: :rule_id, rename: :with_playbook, only_explicit: true, complete_value: false, ext_method: :find_with_playbook

  def self.find_with_playbook(key, operator, value)
    { joins: :rule }
  end

  def has_playbook?
    !rule.nil?
  end

  def host_uuid
    insights_facet.uuid
  end
end
