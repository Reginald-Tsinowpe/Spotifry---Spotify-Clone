# Base image with PHP, Apache, Composer
FROM php:8.2-apache

# Update apt and install necessary libraries for mysqli
RUN apt-get update && apt-get install -y libmariadb-dev

# Install required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Enable Apache rewrite module
RUN a2enmod rewrite

# Copy project files
COPY . /var/www/html/

# Copy .htaccess
COPY .htaccess /var/www/html/.htaccess

# Install Composer and project dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
RUN composer install
RUN chmod 644 /var/www/html/.htaccess

# Expose port 80 for Apache
EXPOSE 80
