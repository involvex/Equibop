#!/bin/sh
set -e

# Restore binding.gyp for build
if [ -f binding.gyp.bak ]; then
    mv binding.gyp.bak binding.gyp
fi

docker build -t libvesktop-builder -f Dockerfile .

docker run --rm -v "$PWD":/src -w /src libvesktop-builder bash -c "
  set -e

  echo '=== Building x64 ==='
  npx node-gyp rebuild --arch=x64
  mv build/Release/vesktop.node prebuilds/vesktop-x64.node

  echo '=== Building arm64 ==='
  export CXX=aarch64-linux-gnu-g++
  npx node-gyp rebuild --arch=arm64
  mv build/Release/vesktop.node prebuilds/vesktop-arm64.node
"

# Rename back to prevent Bun from auto-building on non-Linux
mv binding.gyp binding.gyp.bak