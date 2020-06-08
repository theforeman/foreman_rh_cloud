#!/bin/bash
set -ev

git clone https://github.com/Katello/postgresql-evr.git;
sudo mv postgresql-evr/evr--0.0.2.sql /usr/share/postgresql/9.6/extension/evr--0.0.2.sql;
sudo mv postgresql-evr/evr.control /usr/share/postgresql/9.6/extension/evr.control;
