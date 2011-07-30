require 'bundler/setup'
require 'sinatra'
require 'json'

configure do
	Rack::Mime::MIME_TYPES[".manifest"] = "text/cache-manifest"
end

get '/' do
	# redirect '/clock.html'
	erb :index
end


get '/api/utc' do
	t = Time.now 
  "hello"
  content_type 'text/html', :charset => 'utf-8'
  t.utc.to_json
end