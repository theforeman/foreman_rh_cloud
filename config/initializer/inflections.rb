# Be sure to restart your server when you modify this file.
Rails.autoloaders.each do |autoloader|
  autoloader.inflector.inflect(
 'url_remediations_retriever' => 'URLRemediationsRetriever'    
  )
end

