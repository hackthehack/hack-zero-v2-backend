#!/bin/sh

# Decrypt the file
#sudo mkdir $HOME/secrets
# --batch to prevent interactive command --yes to assume "yes" for questions
sudo gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" \
--output .env.production .env.gpg

# ls $HOME/
# echo "-----ROOT-----Above----"
echo "----current WORKDIR-----"
ls -a /home/runner/work/hack-zero-v2-backend/hack-zero-v2-backend
echo "++++++++++++"
