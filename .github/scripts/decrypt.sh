#!/bin/sh

# Decrypt the file
sudo mkdir $HOME/secrets
# --batch to prevent interactive command --yes to assume "yes" for questions
sudo gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" \
--output $HOME/secrets/.env.production .env.gpg

ls $HOME/
pwd
echo "++++++++++++"
ls -a
