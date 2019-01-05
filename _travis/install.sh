#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)
    
# Import the SSH deployment key
openssl aes-256-cbc -K $encrypted_9543970147d9_key -iv $encrypted_22009518e18d_key -in sandbox-deploy-key.enc -out sandbox-deploy-key -d
chmod 600 sandbox-deploy-key
# mv sandbox-deploy-key ~/.ssh/id_rsa