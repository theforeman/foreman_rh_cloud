#!/bin/bash
set -ev

npm run test;
npm run coveralls;
npm run lint;
