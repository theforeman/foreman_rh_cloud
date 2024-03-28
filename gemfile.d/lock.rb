case ENV['FOREMAN_VERSION']
when '3.9-stable'
  gem "foreman_remote_execution", "< 13"
  gem "foreman_ansible", "< 14"
  gem "katello", "< 12"
end
