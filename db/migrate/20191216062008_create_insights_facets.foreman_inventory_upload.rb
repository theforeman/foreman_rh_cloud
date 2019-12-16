class CreateInsightsFacets < ActiveRecord::Migration[5.2]
  def change
    create_table :insights_facets do |t|
      t.references :host, foreign_key: true
    end
  end
end
