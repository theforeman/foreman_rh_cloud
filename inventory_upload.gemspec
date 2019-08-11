require File.expand_path('lib/inventory_upload/version', __dir__)

Gem::Specification.new do |s|
  s.name        = 'inventory_upload'
  s.version     = InventoryUpload::VERSION
  s.license     = 'GPL-3.0'
  s.authors     = ['Inventory upload team']
  s.email       = ['rlavi@redhat.com, sshtein@redhat.com']
  s.homepage    = 'https://github.com/theforeman/inventory_upload'
  s.summary     = 'Summary of InventoryUpload.'
  # also update locale/gemspec.rb
  s.description = 'Foreman plugin that process & upload data to cloud based host inventory'

  s.files = Dir['{app,config,db,lib,locale}/**/*'] + ['LICENSE', 'Rakefile', 'README.md']
  s.test_files = Dir['test/**/*']

  s.add_dependency 'katello'
  s.add_dependency 'redhat_access'
  s.add_dependency 'sucker_punch'

  s.add_development_dependency 'rdoc'
  s.add_development_dependency 'rubocop'
end
