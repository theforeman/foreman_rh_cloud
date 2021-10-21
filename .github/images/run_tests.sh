#!/bin/bash

bundle install

# wait for postgres
until PGPASSWORD=$PGPASS psql -h "$PGHOST" -U $PGUSER -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 2
done

if [ "$( psql -tAc "SELECT 1 FROM pg_database WHERE datname='foreman-test'" )" = '1' ]
then
    echo "Database already exists"
else
    bundle exec rails db:create
fi

if [ "$( psql -tAc "SELECT 1 FROM pg_database WHERE datname='foreman-prod'" )" = '1' ]
then
    echo "Database already exists"
else
    bundle exec rails db:create RAILS_ENV=production
fi

bundle exec rails db:migrate
# use cache with ttl = 10 weeks, if newer packages are desired, rebuild the container
npm-proxy-cache -t 6048000 &
bundle exec npm i
bundle exec ./script/npm_install_plugins.js

set -e

bundle exec rake foreman_rh_cloud:rubocop
bundle exec rake test:foreman_rh_cloud
bundle exec rake "plugin:assets:precompile[foreman_rh_cloud]" RAILS_ENV=production
bundle exec rake webpack:compile
