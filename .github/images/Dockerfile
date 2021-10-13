FROM centos:7

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
  git clone --depth 1 --branch 2.5-stable https://github.com/theforeman/foreman.git; \
  git clone --depth 1 --branch KATELLO-4.1 https://github.com/Katello/katello.git; \
  git clone --depth 1 --branch v4.1.5 https://github.com/theforeman/foreman-tasks.git; \
  git clone --depth 1 --branch foreman_2_5 https://github.com/theforeman/foreman_rh_cloud.git

RUN \
  cd /projects/foreman; \
  echo "gemspec :path => '../foreman_rh_cloud', :development_group => :dev" > bundler.d/foreman_rh_cloud.local.rb; \
  echo "gemspec :path => '../katello', :development_group => :dev" > bundler.d/katello.local.rb; \
  echo "gemspec :path => '../foreman-tasks', :development_group => :dev, :name => 'foreman-tasks'" > bundler.d/foreman-tasks.local.rb; \
  echo "gem 'foreman_remote_execution', '~> 4.5.6'" > bundler.d/foreman_remote_execution.local.rb; \
  echo "gem 'qpid_proton', '~> 0.33.0'" >> bundler.d/katello.local.rb; \
  cp ../foreman_rh_cloud/config/database.yml.example config/database.yml; \
  cp ../foreman_rh_cloud/config/Gemfile.lock.gh_test Gemfile.lock; \
  cp ../foreman_rh_cloud/config/package-lock.json.gh_test package-lock.json

WORKDIR /projects/foreman
RUN \
  source scl_source enable $SCLS; \
  gem install bundler:1.17.3; \
  bundle config path vendor/bundle; \
  npm install npm-proxy-cache -g; \
  npm config set proxy http://localhost:8080/; \
  npm config set https-proxy http://localhost:8080/; \
  npm config set strict-ssl false
RUN \
  source scl_source enable $SCLS; \
  bundle install --jobs=3 --retry=3 --without journald development console 
RUN \
  source scl_source enable $SCLS; \
  npm-proxy-cache & \
  bundle exec npm install

RUN \
  source scl_source enable $SCLS; \
  npm-proxy-cache & \
  bundle exec ./script/npm_install_plugins.js

COPY ./entrypoint.sh /usr/bin/

RUN sed -i s/SCLS=/SCLS=\""$SCLS"\"/g /usr/bin/entrypoint.sh

RUN chmod +x /usr/bin/entrypoint.sh

COPY ./run_tests.sh /usr/bin/
RUN chmod +x /usr/bin/run_tests.sh

CMD ["/usr/bin/run_tests.sh"]

ENTRYPOINT ["entrypoint.sh"]
