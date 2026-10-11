# Validate editable data before Jekyll renders it. Uses only Ruby's standard library.
require 'yaml'
require 'uri'

root = File.expand_path('..', __dir__)
papers = YAML.safe_load_file(File.join(root, '_data/publications.yml'))
talks = YAML.safe_load_file(File.join(root, '_data/talks.yml'))
errors = []

def unique(values, label, errors)
  errors << "Duplicate #{label}" unless values.compact.uniq.size == values.compact.size
end

unique(papers.map { |p| p['id'] }, 'publication ids', errors)
unique(papers.map { |p| p['doi']&.downcase }, 'publication DOIs', errors)
unique(papers.map { |p| p['arxiv'] }, 'arXiv records', errors)
unique(papers.map { |p| p['scholar_id'] }, 'Scholar entries', errors)
unique(papers.map { |p| p['selected_order'] }, 'homepage selection positions', errors)
types = ['Journal article', 'Conference paper', 'Preprint', 'PhD thesis', 'Master’s thesis']
papers.each do |paper|
  label = paper['id'] || '(missing id)'
  %w[id title authors type citation].each do |field|
    errors << "#{label}: missing #{field}" if paper[field].to_s.strip.empty?
  end
  errors << "#{label}: invalid publication type" unless types.include?(paper['type'])
  errors << "#{label}: invalid year" unless paper['year'].is_a?(Integer) && paper['year'].between?(1900, 2100)
  errors << "#{label}: title contains raw markup" if paper['title'].to_s.match?(/[<>$\\]/)
  published = ['Journal article', 'Conference paper'].include?(paper['type'])
  errors << "#{label}: published entry needs a DOI" if published && !paper['doi']
  errors << "#{label}: a source link is required" unless paper['doi'] || paper['arxiv']
  [paper['doi'], paper.dig('conference_version', 'doi')].compact.each do |doi|
    errors << "#{label}: malformed DOI" unless doi.match?(%r{\A10\.\d{4,9}/\S+\z})
  end
  if paper['arxiv'] && !paper['arxiv'].match?(/\A\d{4}\.\d{4,5}\z/)
    errors << "#{label}: malformed arXiv id"
  end
  if paper['highlight'] == 1 && (!paper['description'] || !paper['image'])
    errors << "#{label}: highlighted papers need a description and image"
  end
end

unique(talks.map { |t| t['anchor'] }, 'talk anchors', errors)
talks.each do |talk|
  label = talk['title'] || '(missing title)'
  %w[title anchor event provider url video].each do |field|
    errors << "#{label}: missing #{field}" if talk[field].to_s.strip.empty?
  end
  case talk['provider']
  when 'YouTube'
    errors << "#{label}: invalid YouTube id" unless talk['video'].match?(/\A[\w-]{11}\z/)
  when 'BIRS'
    uri = URI.parse(talk['video'])
    unless uri.scheme == 'https' && uri.host == 'videos.birs.ca' && uri.port == 443 && uri.userinfo.nil? && uri.path.end_with?('.mp4')
      errors << "#{label}: unexpected BIRS video source"
    end
  else
    errors << "#{label}: unsupported player provider"
  end
end
if ARGV[0]
  bibliography = File.read(File.join(ARGV[0], 'publications/index.html'))
  recordings = File.read(File.join(ARGV[0], 'talks/index.html'))
  papers.each do |paper|
    errors << "#{paper['id']}: missing from rendered bibliography" unless bibliography.include?(%{id="publication-#{paper['id']}"})
    if paper['doi'] && !bibliography.include?(%{href="https://doi.org/#{paper['doi']}"})
      errors << "#{paper['id']}: published DOI is missing from the page"
    end
  end
  talks.each do |talk|
    errors << "#{talk['title']}: missing from rendered recordings" unless recordings.include?(%{id="#{talk['anchor']}"})
  end
end
abort errors.join("\n") unless errors.empty?
puts "PASS: #{papers.size} bibliography entries and #{talks.size} recordings; identifiers, publication types, and source links."
