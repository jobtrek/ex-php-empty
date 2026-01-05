FROM composer:2.9.3 AS composer-base

FROM php:8.5-fpm-trixie

# Install Composer
COPY --from=composer-base /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Expose port for PHP built-in server
EXPOSE 8000

# Default command to start the PHP server
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public/"]
