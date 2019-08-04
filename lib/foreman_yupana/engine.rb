require 'katello'
require 'redhat_access'
require 'sucker_punch'

module ForemanYupana
  class Engine < ::Rails::Engine
    engine_name 'foreman_yupana'

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/lib"]

    # Add any db migrations
    initializer 'foreman_yupana.load_app_instance_data' do |app|
      ForemanYupana::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'foreman_yupana.register_plugin', :before => :finisher_hook do |_app|
      Foreman::Plugin.register :foreman_yupana do
        requires_foreman '>= 1.16'

        # Add permissions
        security_block :foreman_yupana do
          permission :view_foreman_yupana, :'foreman_yupana/reports' => [:last]
        end

        # Add a new role called 'Discovery' if it doesn't exist
        role 'ForemanYupana', [:view_foreman_yupana]

        # Adding a sub menu after hosts menu
        sub_menu :top_menu, :Yupana, :caption => N_('RH Inventory'), :icon => 'fa fa-cloud-upload' do
          menu :top_menu, :level1, :caption => N_('Manage'), :url_hash => { controller: :'foreman_yupana/react', :action=>:index}
        end

        # add dashboard widget
        widget 'foreman_yupana_widget', name: N_('Foreman plugin template widget'), sizex: 4, sizey: 1
      end
    end

    # Include concerns in this config.to_prepare block
    config.to_prepare do
      begin
        Host::Managed.send(:include, ForemanYupana::HostExtensions)
        HostsHelper.send(:include, ForemanYupana::HostsHelperExtensions)
      rescue => e
        Rails.logger.warn "ForemanYupana: skipping engine hook (#{e})"
      end
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        ForemanYupana::Engine.load_seed
      end
    end

    initializer 'foreman_yupana.register_gettext', after: :load_config_initializers do |_app|
      locale_dir = File.join(File.expand_path('../..', __dir__), 'locale')
      locale_domain = 'foreman_yupana'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end
  end
end
