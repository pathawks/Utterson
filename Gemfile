# frozen_string_literal: true

source "https://rubygems.org"

repo = ENV.fetch("REPO", "https://github.com/jekyll/jekyll.git")

if ENV["REF"]
  gem "jekyll", git: repo, ref: ENV["REF"]
elsif ENV["PR"]
  gem "jekyll", git: repo, ref: "refs/pull/#{ENV["PR"]}/head"
else
  gem "jekyll", git: repo, branch: "master"
end

# GitHub Pages
gem "jekyll-avatar"
gem "jekyll-coffeescript"
gem "jekyll-commonmark-ghpages"
gem "jekyll-default-layout"
gem "jekyll-feed"
gem "jekyll-gist"
gem "jekyll-github-metadata"
gem "jekyll-mentions"
gem "jekyll-optional-front-matter"
gem "jekyll-paginate"
gem "jekyll-readme-index"
gem "jekyll-redirect-from"
gem "jekyll-relative-links"
gem "jekyll-remote-theme"
gem "jekyll-sass-converter"
gem "jekyll-seo-tag"
gem "jekyll-sitemap"
gem "jekyll-swiss"
gem "jekyll-theme-architect"
gem "jekyll-theme-cayman"
gem "jekyll-theme-dinky"
gem "jekyll-theme-hacker"
gem "jekyll-theme-leap-day"
gem "jekyll-theme-merlot"
gem "jekyll-theme-midnight"
gem "jekyll-theme-minimal"
gem "jekyll-theme-modernist"
gem "jekyll-theme-primer"
gem "jekyll-theme-slate"
gem "jekyll-theme-tactile"
gem "jekyll-theme-time-machine"
gem "jekyll-titles-from-headings"
gem "jemoji"
gem "kramdown"

# CloudCannon/base-jekyll-template
gem "jekyll-archives"
gem "jekyll-extract-element"

# DirtyF/frank.taillandier.me
gem "classifier-reborn"
gem "jekyll-cloudinary", group: :jekyll_plugins
gem "jekyll-include-cache"
gem "jekyll-last-modified-at"
gem "jekyll-tidy"

# 18F/federalist-docs
gem "jekyll_pages_api_search", group: :jekyll_plugins
gem "redcarpet"
gem "uswds-jekyll"

group :dev do
  gem "rubocop-jekyll", "~> 0.4"
end
