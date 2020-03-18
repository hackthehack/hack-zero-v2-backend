#!/bin/sh

# Decrypt the file
mkdir $Home/secrets
# --batch to prevent interactive command --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" \
--output $Home/secrets/.env.production .env.gpg
