class CreateInsightsHits < ActiveRecord::Migration[5.2]
  def change
    create_table :insights_hits do |t|
      t.references :host, foreign_key: true
      t.datetime :last_seen
      t.string :title
      t.string :solution_url
      t.integer :total_risk
      t.integer :likelihood
      t.datetime :publish_date
      t.string :results_url
    end
  end
end
