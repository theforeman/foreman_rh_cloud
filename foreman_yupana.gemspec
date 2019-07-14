require File.expand_path('lib/foreman_yupana/version', __dir__)

Gem::Specification.new do |s|
  s.name        = 'foreman_yupana'
  s.version     = ForemanYupana::VERSION
  s.license     = 'GPL-3.0'
  s.authors     = ['Foreman Yupana team']
  s.email       = ['rlavi@redhat.com, sshtein@redhat.com']
  s.homepage    = 'https://github.com/theforeman/foreman_yupana'
  s.summary     = 'Summary of ForemanYupana.'
  # also update locale/gemspec.rb
  s.description = 'Foreman plugin that process & upload data to the host based inventory'

  s.files = Dir['{app,config,db,lib,locale}/**/*'] + ['LICENSE', 'Rakefile', 'README.md']
  s.test_files = Dir['test/**/*']

  s.add_development_dependency 'rdoc'
  s.add_development_dependency 'rubocop'
end
