#!/bin/bash
set -ev

npm run test;
npm run publish-coverage;
npm run lint;
