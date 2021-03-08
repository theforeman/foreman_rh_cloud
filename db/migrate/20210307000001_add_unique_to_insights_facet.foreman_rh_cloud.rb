class AddUniqueToInsightsFacet < ActiveRecord::Migration[5.2]
  def change
    # Remove duplicate records
    InsightsFacet.where.not(id: InsightsFacet.select('max(id)').group(:host_id)).delete_all

    # remove old index
    remove_index :insights_facets, [:host_id]
    # add unique constraint
    add_index :insights_facets, [:host_id], unique: true
  end
end
