class ChangeResolutions < ActiveRecord::Migration[5.2]
  def change
    remove_column :insights_resolutions, :system_type, :integer
    remove_column :insights_resolutions, :has_playbook, :boolean
    rename_column :insights_resolutions, :resolution, :description
    add_column :insights_resolutions, :needs_reboot, :boolean
    add_column :insights_resolutions, :resolution_risk, :integer
    add_column :insights_resolutions, :resolution_type, :string
  end
end
