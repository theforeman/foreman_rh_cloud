require 'katello'
require 'redhat_access'

module ForemanInventoryUpload
  class Engine < ::Rails::Engine
    engine_name 'foreman_inventory_upload'

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/lib"]

    config.eager_load_paths += Dir["#{config.root}/lib"]

    # Add any db migrations
    initializer 'foreman_inventory_upload.load_app_instance_data' do |app|
      ForemanInventoryUpload::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'foreman_inventory_upload.register_plugin', :before => :finisher_hook do |_app|
      Foreman::Plugin.register :foreman_inventory_upload do
        requires_foreman '~> 1.24.0'

        # Add permissions
        security_block :foreman_inventory_upload do
          permission :view_foreman_inventory_upload, :'foreman_inventory_upload/reports' => [:last]
        end

        # Add a new role called 'Discovery' if it doesn't exist
        role 'ForemanInventoryUpload', [:view_foreman_inventory_upload]

        # Adding a sub menu after hosts menu
        sub_menu :top_menu, :foreman_inventory_upload, :caption => N_('RH Inventory'), :icon => 'fa fa-cloud-upload' do
          menu :top_menu, :level1, :caption => N_('Manage'), :url_hash => { controller: :'foreman_inventory_upload/react', :action => :index}
        end
      end
    end

    initializer "foreman_inventory_upload.set_dynflow.config.on_init", :before => :finisher_hook do |_app|
      unless Rails.env.test?
        ForemanTasks.dynflow.config.on_init do |world|
          ForemanInventoryUpload::Async::GenerateAllReportsJob.spawn_if_missing(world)
        end
      end
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        ForemanInventoryUpload::Engine.load_seed
      end
    end

    initializer 'foreman_inventory_upload.register_gettext', after: :load_config_initializers do |_app|
      locale_dir = File.join(File.expand_path('../..', __dir__), 'locale')
      locale_domain = 'foreman_inventory_upload'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end
  end
end
