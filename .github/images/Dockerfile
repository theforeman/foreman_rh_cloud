FROM quay.io/centos/centos:stream8 AS base

ENV PGHOST=postgres
ENV PGUSER=foreman
ENV PGPASS=foreman
ENV RAILS_ENV=test
ENV GIT_COMMITTER_NAME="gh_actions"
ENV GIT_COMMITTER_EMAIL="gh_actions@rh_cloud.foreman"
ENV WORKDIR=/projects/foreman
ENV BUNDLE_PATH=vendor/bundle

RUN \
  dnf module install -y ruby:2.7 nodejs:14 postgresql:12;\
  dnf install -y epel-release; \
  dnf install -y redhat-rpm-config libpq-devel ruby-devel systemd-devel make tar libvirt-devel zlib-devel libxml2-devel openssl-libs libvirt-devel nodejs automake gcc gcc-c++ kernel-devel libcurl-devel sqlite-devel npm git postgresql-server-devel qpid-proton-cpp-devel; \
  git config --global user.name $GIT_COMMITTER_NAME; \
  git config --global user.email $GIT_COMMITTER_EMAIL; \
  mkdir /projects; \
  cd /projects; \
  git clone --depth 1 --branch 3.3-stable https://github.com/theforeman/foreman.git; \
  git clone --depth 1 --branch KATELLO-4.5 https://github.com/Katello/katello.git; \
  git clone --depth 1 --branch v6.0.2 https://github.com/theforeman/foreman-tasks.git; \
  git clone --depth 1 --branch master https://github.com/theforeman/foreman_rh_cloud.git

RUN \
  cd /projects/foreman; \
  echo "gemspec :path => '../foreman_rh_cloud', :development_group => :dev" > bundler.d/foreman_rh_cloud.local.rb; \
  echo "gemspec :path => '../katello', :development_group => :dev" > bundler.d/katello.local.rb; \
  echo "gemspec :path => '../foreman-tasks', :development_group => :dev, :name => 'foreman-tasks'" > bundler.d/foreman-tasks.local.rb; \
  echo "gem 'foreman_remote_execution', '~> 7.1.0'" > bundler.d/foreman_remote_execution.local.rb; \
  echo "gem 'foreman_ansible', '~> 7.1.2'" > bundler.d/foreman_ansible.local.rb; \
  echo "gem 'qpid_proton', '~> 0.33.0'" >> bundler.d/katello.local.rb; \
  cp ../foreman_rh_cloud/config/database.yml.example config/database.yml; \
  cp ../foreman_rh_cloud/config/Gemfile.lock.gh_test Gemfile.lock;

WORKDIR /projects/foreman
RUN \
  bundle config path vendor/bundle; \
  npm install pnpm -g;

RUN \
  cd /projects/foreman; \
  rm -rf Gemfile.lock; \
  bundle install --jobs=3 --retry=3 --without journald development console

RUN rm -rf /projects/foreman/npm_install_plugins.js
COPY ./npm_install_plugins.js /projects/foreman/script/npm_install_plugins.js
RUN \
  cd /projects/foreman; \
  chmod +x ./script/npm_install_plugins.js; \
  bundle exec pnpm install; \
  pnpm i @redhat-cloud-services/frontend-components; \
  pnpm i graphql-tag@^2.0.0; \
  bundle exec ./script/npm_install_plugins.js

RUN \
  cd /projects/foreman_rh_cloud; \
  pnpm i @redhat-cloud-services/frontend-components

COPY ./entrypoint.sh /usr/bin/

RUN sed -i s/SCLS=/SCLS=\""$SCLS"\"/g /usr/bin/entrypoint.sh

RUN chmod +x /usr/bin/entrypoint.sh

COPY ./run_tests.sh /usr/bin/
RUN chmod +x /usr/bin/run_tests.sh

CMD ["/usr/bin/run_tests.sh"]

ENTRYPOINT ["entrypoint.sh"]
