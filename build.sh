#!/bin/bash

cd popup && npm ci && npm run build && cd ../content-scripts && npm ci && npm run build
