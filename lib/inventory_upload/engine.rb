require 'katello'
require 'redhat_access'
require 'sucker_punch'

module InventoryUpload
  class Engine < ::Rails::Engine
    engine_name 'inventory_upload'

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/lib"]

    # Add any db migrations
    initializer 'inventory_upload.load_app_instance_data' do |app|
      InventoryUpload::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'inventory_upload.register_plugin', :before => :finisher_hook do |_app|
      Foreman::Plugin.register :inventory_upload do
        requires_foreman '>= 1.20'

        # Add permissions
        security_block :inventory_upload do
          permission :view_inventory_upload, :'inventory_upload/reports' => [:last]
        end

        # Add a new role called 'Discovery' if it doesn't exist
        role 'InventoryUpload', [:view_inventory_upload]

        # Adding a sub menu after hosts menu
        sub_menu :top_menu, :inventory_upload, :caption => N_('RH Inventory'), :icon => 'fa fa-cloud-upload' do
          menu :top_menu, :level1, :caption => N_('Manage'), :url_hash => { controller: :'inventory_upload/react', :action=>:index}
        end
      end
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        InventoryUpload::Engine.load_seed
      end
    end

    initializer 'inventory_upload.register_gettext', after: :load_config_initializers do |_app|
      locale_dir = File.join(File.expand_path('../..', __dir__), 'locale')
      locale_domain = 'inventory_upload'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end
  end
end
