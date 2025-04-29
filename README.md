Google Gmail API docs: https://developers.google.com/workspace/gmail/api/guides
https://developers.google.com/workspace/gmail/api/reference/rest
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

1. Obtener mensajes. (hecho)
2. Obtener titulo del mensaje (hecho).
3. Obtener fecha recibida del mensaje (hecho).
3.1 Optimizar peticiones para obtener los nombres (hecho).
4. Paginación.
4.1 Cambiar pagina hacia adelante (hecho).
4.2 Cambiar pagina hacia atras.
5. Mantener sesión activa. (hecho)
6. Renovar sesión. (hecho)
7. Implementar variables de entorno. (hecho)
8. Solventar problema HTTP: 429 - STATUS: RESOURCE_EXHAUSTED
9. Remover credenciales innecesarias (API_KEY). (hecho)
10. Filtro de búsqueda.