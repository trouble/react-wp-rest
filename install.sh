#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then

    # Download and install wp-cli
    wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    sudo chmod +x wp-cli.phar
    sudo mv wp-cli.phar /usr/local/bin/wp
    # Download and install robo
    wget http://robo.li/robo.phar
    sudo chmod +x robo.phar
    sudo mv robo.phar /usr/bin/robo

elif [[ "$OSTYPE" == "darwin"* ]]; then
    # Download and install wp-cli
    brew install homebrew/php/wp-cli
    # Download and install robo
    brew install homebrew/php/robo
else
    echo "Sorry, this installation script only works on Mac OS X and Ubuntu Linux. Looks like your operating system is $OSTYPE."
fi