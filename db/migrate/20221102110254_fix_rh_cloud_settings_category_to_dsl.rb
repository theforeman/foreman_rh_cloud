# frozen_string_literal: true

class FixRhCloudSettingsCategoryToDsl < ActiveRecord::Migration[6.0]
  def up
    Setting.where(category: 'Setting::RhCloud').update_all(category: 'Setting') if column_exists?(:settings, :category)
  end
end
