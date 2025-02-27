# Зачем использовать Next.js в AlgoHack

## 1. API Routes вместо отдельного сервера
Next.js позволяет писать серверные API прямо в `pages/api/`, без необходимости поднимать отдельный backend на Express.js или FastAPI.

Пример API для получения данных из PostgreSQL:
```js
export default async function handler(req, res) {
  const result = await pool.query('SELECT * FROM algorithms');
  res.status(200).json(result.rows);
}
```
Без Next.js пришлось бы запускать отдельный сервер.

## 2. SSR для больших текстов
У нас БД содержит длинные описания алгоритмов. SSR позволяет загружать их на сервере, а не рендерить на клиенте.

Пример серверного рендеринга:
```js
export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/database');
  const data = await res.json();
  return { props: { data } };
}
```
Без Next.js весь текст загружался бы через `useEffect`, что дольше и тяжелее для клиента.

## 3. Оптимизация загрузки данных
Next.js умеет предзагружать страницы и кэшировать API-запросы. Это снижает нагрузку на сервер и ускоряет работу сайта.

Пример статической генерации:
```js
export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/database');
  const data = await res.json();
  return { props: { data } };
}
```
Без Next.js пришлось бы делать каждый запрос динамическим, увеличивая задержки.

## 4. Отсутствие проблем с CORS
API работает локально в Next.js, что избавляет от проблем с CORS. В React без Next.js пришлось бы настраивать заголовки на сервере.

## 5. Упрощенный деплой
С Next.js фронтенд и API деплоятся как одно приложение. Без него пришлось бы деплоить React и API отдельно, усложняя настройку серверов.
