ForemanRhCloud.on_prem_smart_proxy_features.each do |feature_name|
  f = Feature.where(:name => feature_name).first_or_create
  raise "Unable to create proxy feature: #{SeedHelper.format_errors f}" if f.nil? || f.errors.any?
end
