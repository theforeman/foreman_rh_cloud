class DropTaskOutputTables < ActiveRecord::Migration[6.0]
  def up
    drop_table :task_output_lines
    drop_table :task_output_statuses
  end

  def down
    create_table :task_output_lines do |t|
      t.string :label
      t.string :line
      t.timestamps

      t.index :label
    end

    create_table :task_output_statuses do |t|
      t.string :label
      t.string :status
      t.timestamps

      t.index :label, unique: true
    end
  end
end
