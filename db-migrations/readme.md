# Database migrations how to use

Данный скрипт преобразует photoUrl объекта profile с '/public' на '45.61.48.153',
а также funnelBackground объекта funnel с '/public' на '45.61.48.153'.


1) Клонируем эту папку рядом с папкой BackEnd.
2) Запускаем в ней:
```
npm install
```
3) Переходим в папку BackEnd и запускаем: 
```
npm run migratedb
```