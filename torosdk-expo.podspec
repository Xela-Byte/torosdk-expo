require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'torosdk-expo'
  s.version        = package['version']
  s.summary        = package['description'] || 'Expo wrapper for torosdk'
  s.description    = 'Expo-compatible SDK for Toronet — wallet management, balance queries, and Toro API integration with native NWConnection transport for Darwin 25 compatibility.'
  s.license        = package['license']
  s.homepage       = package['homepage'] || 'https://github.com/xelalabsv/torosdk-expo'
  s.authors        = 'ToroForge'
  s.source         = { :git => 'https://github.com/xelalabsv/torosdk-expo.git', :tag => "v#{s.version}" }
  s.source_files   = 'ios/**/*.{h,m,mm,swift}'
  s.platforms      = { :ios => '15.1' }

  # React Native bridge
  s.dependency 'React-Core'

  # System frameworks
  s.frameworks = 'Network'
end
