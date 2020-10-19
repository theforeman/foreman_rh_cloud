class SetupHitsCountCache < ActiveRecord::Migration[5.0]
  def up
    ActiveRecord::Base.connection.execute <<-SQL.squish
    UPDATE insights_facets
    SET hits_count = (SELECT count(1)
                              FROM insights_hits
                              WHERE insights_hits.host_id = insights_facets.host_id)
    SQL
  end
end
