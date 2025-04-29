Google Gmail API docs: https://developers.google.com/workspace/gmail/api/guides https://developers.google.com/workspace/gmail/api/reference/rest
Google Cloud Console: https://console.cloud.google.com

Intrucciones:

1. Crear proyecto en Google Cloud Console.
2. Agregar credenciales (CLIENT_ID, CALLBACK)
2.1. OAuth 2.0 & Client IDs and callback URL
2.2. API Key
3. Activar servicios y APIs a usar (Gmail API)
4. Publicar proyecto (Project -> Audience -> Publish status -> Testing -> Publish app)
5. Agregar credenciales en el código (Client Id, API key, callback URL)

Caracteristicas:

[x] Obtener mensajes.
[x] Obtener titulo del mensaje.
[x] Obtener fecha recibida del mensaje.
[x] Optimizar peticiones para obtener los nombres.
[] Paginación.
    [x] Cambiar pagina hacia adelante.
    [] Cambiar pagina hacia atrás.
[x] Mantener sesión activa.
[x] Renovar sesión.
[x] Implementar variables de entorno.
[] Solventar problema HTTP: 429 - STATUS: RESOURCE_EXHAUSTED
[x] Remover credenciales innecesarias (API_KEY).
[] Filtro de búsqueda.