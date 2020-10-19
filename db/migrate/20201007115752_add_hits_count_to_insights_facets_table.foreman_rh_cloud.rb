class AddHitsCountToInsightsFacetsTable < ActiveRecord::Migration[5.0]
  def change
    add_column :insights_facets, :hits_count, :integer
  end
end
