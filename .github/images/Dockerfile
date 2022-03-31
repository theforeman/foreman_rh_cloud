FROM quay.io/centos/centos:centos7 AS base

ENV PGHOST=postgres
ENV PGUSER=foreman
ENV PGPASS=foreman
ENV RAILS_ENV=test
ENV GIT_COMMITTER_NAME="gh_actions"
ENV GIT_COMMITTER_EMAIL="gh_actions@rh_cloud.foreman"
ENV WORKDIR=/projects/foreman
ENV BUNDLE_PATH=vendor/bundle

ARG SCLS="rh-ruby25 rh-nodejs12 sclo-git25 rh-postgresql12"

RUN \
  yum install -y centos-release-scl epel-release; \
  yum install -y systemd-devel make tar libvirt-devel rh-ruby25-ruby-devel zlib-devel libxml2-devel openssl-libs libvirt-devel nodejs rh-ruby25-rubygems automake gcc gcc-c++ kernel-devel libcurl-devel sqlite-devel rh-nodejs12-npm sclo-git25 rh-postgresql12-postgresql-devel rh-postgresql12-postgresql qpid-proton-cpp-devel; \
  source scl_source enable $SCLS; \
  git config --global user.name $GIT_COMMITTER_NAME; \
  git config --global user.email $GIT_COMMITTER_EMAIL; \
  mkdir /projects; \
  cd /projects; \
  git clone --depth 1 --branch 3.1-stable https://github.com/theforeman/foreman.git; \
  git clone --depth 1 --branch KATELLO-4.3 https://github.com/Katello/katello.git; \
  git clone --depth 1 --branch v5.2.0 https://github.com/theforeman/foreman-tasks.git; \
  git clone --depth 1 --branch master https://github.com/theforeman/foreman_rh_cloud.git

RUN \
  cd /projects/foreman; \
  echo "gemspec :path => '../foreman_rh_cloud', :development_group => :dev" > bundler.d/foreman_rh_cloud.local.rb; \
  echo "gemspec :path => '../katello', :development_group => :dev" > bundler.d/katello.local.rb; \
  echo "gemspec :path => '../foreman-tasks', :development_group => :dev, :name => 'foreman-tasks'" > bundler.d/foreman-tasks.local.rb; \
  echo "gem 'foreman_remote_execution', '~> 4.8.0'" > bundler.d/foreman_remote_execution.local.rb; \
  echo "gem 'qpid_proton', '~> 0.33.0'" >> bundler.d/katello.local.rb; \
  cp ../foreman_rh_cloud/config/database.yml.example config/database.yml; \
  cp ../foreman_rh_cloud/config/Gemfile.lock.gh_test Gemfile.lock;

WORKDIR /projects/foreman
RUN \
  source scl_source enable $SCLS; \
  gem install bundler:1.17.3; \
  bundle config path vendor/bundle; \
  npm install pnpm -g;

RUN \
  source scl_source enable $SCLS; \
  cd /projects/foreman; \
  bundle install --jobs=3 --retry=3 --without journald development console

RUN \
  source scl_source enable $SCLS; \
  cd /projects/foreman; \
  bundle exec pnpm install; \
  pnpm i @redhat-cloud-services/frontend-components; \
  pnpm i graphql-tag@^2.0.0 # install missing peer dep

RUN rm -rf /projects/foreman/npm_install_plugins.js
COPY ./npm_install_plugins.js /projects/foreman/script/npm_install_plugins.js
RUN \
  source scl_source enable $SCLS; \
  cd /projects/foreman; \
  chmod +x ./script/npm_install_plugins.js; \
  bundle exec ./script/npm_install_plugins.js

# symlink external module for css loader.
RUN ln -s .pnpm/node_modules/@redhat-cloud-services node_modules/

COPY ./entrypoint.sh /usr/bin/

RUN sed -i s/SCLS=/SCLS=\""$SCLS"\"/g /usr/bin/entrypoint.sh

RUN chmod +x /usr/bin/entrypoint.sh

COPY ./run_tests.sh /usr/bin/
RUN chmod +x /usr/bin/run_tests.sh

CMD ["/usr/bin/run_tests.sh"]

ENTRYPOINT ["entrypoint.sh"]
