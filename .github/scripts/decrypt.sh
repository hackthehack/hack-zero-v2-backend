#!/bin/sh

# Decrypt the file
sudo mkdir $Home/secrets
# --batch to prevent interactive command --yes to assume "yes" for questions
sudo gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" \
--output $Home/secrets/.env.production .env.gpg
