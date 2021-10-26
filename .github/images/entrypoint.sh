#!/bin/bash
export PATH=~/bin:${GEM_HOME}/bin:${PATH}

SCLS=

if [ -x "$(command -v scl_source)" ]; then
  source scl_source enable $SCLS
fi

cd $WORKDIR
exec "$@"