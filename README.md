# Php trainings

> v0.1.78 <!-- x-release-please-version -->

## Prerequisites

- [PHP](https://www.php.net/) 8.5 - *A `Dockerfile` is available in this repo if you cannot install PHP 8.5*
- [composer](https://getcomposer.org/doc/00-intro.md) - (not needed if you use the container)
- [Node.js](https://nodejs.org) version 24 - **Use your linux distribution repository or [fnm](https://github.com/Schniz/fnm?tab=readme-ov-file#installation)**
- [Pnpm](https://pnpm.io/installation) version 10 - **Use pnpm official installation script for posix systems**

> You can check working installation with `php -v` and `composer -v`.

## Get source and install dependencies

```shell
# Clone or download the repository
# move into project repository
cd ex-php
# Install dependencies (only if you have php 8.5 and node 24)
composer install
pnpm i # Npm has nothing to do with php, but we will need it to run tests
```

If you do not want to, or cannot, install PHP 8.5 on your system, this
repo has a simple `Dockerfile` with right PHP version. You can use it to run any PHP commands :

```shell
# FISRT, you need to build the docker image
docker build -t ex-php .
# Install PHP dependencies with PHP into the container
docker run -it --rm -v $(pwd):/app ex-php sh -c "composer install && pnpm install"
# Run the php server in the container
docker run -it --rm -p 8000:8000 -v $(pwd):/app ex-php
# Run the automatic test with pest
docker run -it --rm -v $(pwd):/app ex-php ./vendor/bin/pest
# If you want, you can use PHPstan to help catch errors with linting
docker run -it --rm -v $(pwd):/app ex-php sh -c "vendor/bin/phpstan"
```

> **You still need to have node 24 and pnpm installed on your host machine to run the tests.**

## Language syntax exercises

Minimalist PHP exercise to discover the syntax.

> To launch the tests, you can use `./vendor/bin/pest` command

1. [Basics](src/Basics.php)
2. [Arrays and Loops](src/ArraysAndLoops.php)

## Generating and processing web pages

PHP is well known for its ability to generate web pages (It was originally created for that purpose).
The following exercises will help you to understand how to generate web pages with PHP.
To test your php web pages, you need to run the PHP web server with the `Dockerfile` or with `php -S localhost:8000 -t public/` if you use PHP on your host machine.
Once the server is running, you can open your browser and go to [localhost](http://localhost:8000) to see your web pages.

> To test if your pages work, use playwright tests : **[You need to start playwright docker container first](#install-and-start-playwright)**.
> You can run them from the playwright ui (Playwright automatically start php dev server).

1. [Get current time](public/getCurrentTime.php)
2. [Query parameters](public/queryParameterDisplay.php)
3. [Forms](public/formManagement.php)
3. [Create todo's and write them to database](public/writeTodoToDatabase.php)
3. [Display a list of todo's from database](public/displayAllTodosFromDatabase.php)
3. [Delete à todo in database](public/deleteTodoFromDatabase.php)

## Install and start Playwright

You can easily **run the playwright server** on a docker container :
```shell
docker run --rm --network host --init -it mcr.microsoft.com/playwright:v1.58.2-noble /bin/sh -c "cd /home/pwuser && npx -y playwright@1.58.2 run-server --port 8080"
```
This will start a docker container with the playwright server and all the browsers binary and libraries.

Then, when **running your playwright tests**, just add an environment variable with the server location :
```shell
PW_TEST_CONNECT_WS_ENDPOINT=ws://localhost:8080/ pnpm exec playwright test
# Or with UI
PW_TEST_CONNECT_WS_ENDPOINT=ws://localhost:8080/ pnpm exec playwright test --ui-port=9090
```
With this setup, the test logic will run on the host, but the browsers will remain in the container.

> More information [here](https://discuss.layer5.io/t/how-to-setup-e2e-testing-environment-with-playwright-and-docker-for-meshery/5498).
