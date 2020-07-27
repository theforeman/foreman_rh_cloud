class AddUuidColumnToInsightsFacets < ActiveRecord::Migration[5.2]
  def change
    add_column :insights_facets, :uuid, :string
  end
end
