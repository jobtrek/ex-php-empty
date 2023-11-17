# Php trainings

## Prerequisites

1. A working installation of PHP on your system. [You need PHP 8.2 !](https://www.php.net/releases/8.2/en.php)
   On fedora you can use [remi repositories](https://rpms.remirepo.net/wizard/) to install recent versions of PHP.
2. You need to install [composer](https://getcomposer.org/doc/00-intro.md)

> You can check working installation with `php -v` and `composer -v`.

## Get source and install dependencies

```shell
# Clone or download the repository
# move into project repository
cd ex-php
# Install dependencies
composer install
npm i # Npm has nothing to do with php, but we will need it to run tests
npx playwright install # Install headless browser for tests automation
```

## Language syntax exercises

> To launch the tests, you can use `./vendor/bin/pest` command, or
> install [Pest plugin](https://pestphp.com/docs/editor-setup) on your IDE.

1. [Basics](src/Basics.php)
2. [Arrays and Loops](src/ArraysAndLoops.php)

## Generating and processing web pages

Php is well known for its ability to generate web pages.
The following exercises will help you to understand how to generate web pages with PHP.
To test your php web pages, you need to run the following command `php -S localhost:8000 -t public/`.
Once the server is running, you can open your browser and go to [localhost](http://localhost:8000).

> To test if your pages work, run `npx playwright test`.

1. [Get current time](public/getCurrentTime.php)
2. [Query parameters](public/queryParameterDisplay.php)
3. [Forms](public/formManagement.php)

## Discover object-oriented programming

> Work in progress
