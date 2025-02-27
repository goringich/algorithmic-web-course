## Что такое Workbox?
Workbox — это инструмент от Google, который упрощает работу с **Service Worker** для кэширования ресурсов, ускорения загрузки и поддержки оффлайн-режима.

Workbox поможет:
- Кэшировать статические файлы (`JS`, `CSS`, `HTML`, `шрифты`, `изображения`).
- Улучшить производительность за счет `runtime caching`.
- Разрешить работу сайта даже при потере соединения.

---

## Установка Workbox
```sh
npm install workbox-build --save-dev
```

---

## Конфигурация Workbox
Создаем файл `workbox-config.js` в корне проекта:

```js
module.exports = {
  globDirectory: 'public/',
  globPatterns: ['**/*.{html,js,css,png,jpg,svg}'],
  swDest: 'public/sw.js',
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
      },
    },
  ],
};
```

---

## Генерация `sw.js`
Добавляем команду в `package.json`:

```json
"scripts": {
  "build-sw": "workbox injectManifest workbox-config.js"
}
```

Запускаем:
```sh
npm run build-sw
```

---

## Регистрация Service Worker
Добавляем в `App.js`:

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('Service Worker зарегистрирован!');
  }).catch(err => {
    console.error('Ошибка регистрации Service Worker:', err);
  });
}
```

