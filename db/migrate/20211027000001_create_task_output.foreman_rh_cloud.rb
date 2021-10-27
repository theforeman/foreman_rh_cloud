class CreateTaskOutput < ActiveRecord::Migration[5.2]
  def change
    create_table :task_output_lines do |t|
      t.string :label
      t.string :line
      t.timestamps

      t.index :label
    end

    create_table :task_output_statuses do |t|
      t.string :label
      t.string :status

      t.index :label, unique: true
    end
  end
end
