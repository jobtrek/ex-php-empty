FROM composer:2.9.5 AS composer-base

FROM php:8.5-fpm-trixie

# Install Composer
COPY --from=composer-base /usr/bin/composer /usr/bin/composer

RUN apt-get update && apt-get install -y --no-install-recommends \
	git \
	&& rm -rf /var/lib/apt/lists/*

ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/


RUN set -eux; \
	install-php-extensions \
    zip \
    ;

# Set working directory
WORKDIR /app

# Expose port for PHP built-in server
EXPOSE 8000

# Default command to start the PHP server
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public/"]
