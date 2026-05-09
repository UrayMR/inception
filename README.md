# Inception

**Inception** is a web-based platform dedicated to managing academic competitions within the **Informatics Department at UPN "Veteran" Jawa Timur**. This website is used for information and registration regarding Inception competitions.

## How To Contribute

1. **Clone the repository**
   ```bash
   git clone https://github.com/UrayMR/inception.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd inception
   ```

3. **Install dependencies**
   ```bash
    composer install
    npm install
    ```

4. **Set up environment variables**
    ```bash
    cp .env.example .env
    ```
    Then, edit the `.env` file to configure your database and other settings.

5. **Generate application key**
    ```bash
    php artisan key:generate
    ```

6. **Set Up Storage Link**
    ```bash
    php artisan storage:link
    ```

7. **Run database migrations**
    ```bash
    php artisan migrate --seed
    ```

8. **Optimize the application**
    ```bash
    php artisan optimize
    ```

9. **Start the development server**
    ```bash
    composer run dev
    ```

10. **Access the application**
    Open your web browser and navigate to `http://localhost:8000` to start developing and testing the application.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

