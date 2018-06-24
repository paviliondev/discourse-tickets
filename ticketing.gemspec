$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "ticketing/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "ticketing"
  s.version     = Ticketing::VERSION
  s.authors     = ["Betsy Haibel"]
  s.email       = ["betsy.haibel@gmail.com"]
  s.summary     = "Ticketing Discourse Plugin for Namati"
  s.description = "Ticketing Discourse Plugin for Namati"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "LICENSE.txt", "Rakefile", "README.md"]

  s.add_dependency "rails", "~> 5.1.6"

  s.add_development_dependency "sqlite3"
  s.add_development_dependency "rspec-rails"
end
