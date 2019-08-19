module ForemanInventoryUploadHelper
  if Foreman::Version.new.minor.to_i < 23
    def webpacked_plugins_css_for(*plugin_names)
      css_tags_for(select_requested_plugins(plugin_names)).join.html_safe
    end

    def css_tags_for(requested_plugins)
      requested_plugins.map do |plugin|
        stylesheet_link_tag(*webpack_asset_paths(plugin.to_s, :extension => 'css'), "data-turbolinks-track" => true)
      end
    end
  end
end
