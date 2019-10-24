# дока по развороту Funnels

Front:

1) Устанавливаем apache2.
2) Клонируем репозиторий в директорию "/var/www/html"
3) Переходим в директорию "/var/www/html/Funnels/FrontEnd/funnelsmapFrontend/src" 
   В фале "config.js" прописываем API_URL.
4) Переходим в директорию "/var/www/html/Funnels/FrontEnd/funnelsmapFrontend"
   Выполняем "npm install", затем "npm run-script build".
5) В появившейся папке "build" создаем файл ".htaccess" с содержимым:
	RewriteEngine On
	RewriteCond %{REQUEST_URI} !^/index.html$
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteCond %{REQUEST_URI} !\.(css|gif|ico|jpg|js|png|swf|txt|svg|woff|ttf|eot)$
	RewriteRule . index.html [L]
6) Редактируем файл конфигурации сайта по пути "/etc/apache2/sites-enabled/000-default.conf". 
Изменяем DocumentRoot на  "/var/www/html/Funnels/FrontEnd/funnelsmapFrontend/build".
7) Редактируем файл конфигурации apache2 по пути "/etc/apache2/apache2.conf".
В секции "<Directory /var/www/>" прописываем "AllowOverride All".

Back:

1) Устанавливаем docker и docker-compose.

install docker:

sudo apt install apt-transport-https ca-certificates curl software-properties-common
-------------------------------------------------------------------------------------------------
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
-------------------------------------------------------------------------------------------------
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
-------------------------------------------------------------------------------------------------
sudo apt install docker-ce

install docker-compose:

sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
-------------------------------------------------------------------------------------------------
sudo chmod +x /usr/local/bin/docker-compose

2) Клонируем репозиторий.
3) В файле ".env" по пути "/Funnels/back/src" прописываем "PROD_URL".
4) В файле "funnelController.js" по пути "Funnels/back/src/controllers" находим "createUrl: async function (req, res)" и прописываем "let url".
5) Переходим в директорию "/Funnels/back" и выполняем "sudo docker-compose up -d".
   Бэк поднимется на 9001 порту.
Если по пути "Funnels/back/src/public" нет папок avatars, screenshots, funnelBackgrounds, создаем их вручную.
