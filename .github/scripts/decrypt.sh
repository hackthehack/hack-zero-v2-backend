#!/bin/sh

# Decrypt the file
#sudo mkdir $Home/secrets
# --batch to prevent interactive command --yes to assume "yes" for questions
sudo gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" \
--output /github/home/.env.production .env.gpg

ls /github/home
ls -a
