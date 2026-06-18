#!/bin/bash

BASE_DIR=`pwd`
# zip everything into "presentation.zip"
rm -f $BASE_DIR/presentation.zip
rm -Rf $BASE_DIR/dist/

yarn build

if [ -d $BASE_DIR/dist/ ]
then
  #cp -R ./node_modules/@fortawesome/fontawesome-pro/webfonts/* dist/fonts/

  cd $BASE_DIR/dist/
  #rm -f accounts.json
  zip -r $BASE_DIR/presentation.zip .
  cd $BASE_DIR
else
  echo "ERROR"
  exit
fi
