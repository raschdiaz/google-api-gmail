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

:pushpin: Lista de mensajes.

:white_check_mark: Obtener titulo del mensaje.

:white_check_mark: Obtener fecha recibida del mensaje.

:white_check_mark: Optimizar peticiones para obtener los nombres.

:white_check_mark: Filtro de búsqueda.

:white_check_mark: Botón recargar lista.

:white_check_mark: Solventar problema HTTP: 429 - STATUS: RESOURCE_EXHAUSTED

:white_check_mark: Agregar indicador de carga al realizar peticiones.

:white_check_mark: Revisar error al obtener ciertos mensajes HTTP: 429 - rateLimitExceeded.

:white_square_button: Corregir error de mensajes incorrectos por página cuando se reciben nuevos mensajes (users.history.list).

:white_square_button: Filtro multiple: (campo texto, cantidad paginación, pagina actual).

:pushpin: Paginación.

:white_check_mark: Cambiar pagina hacia adelante.

:white_check_mark: Cambiar pagina hacia atrás.

:white_check_mark: Permitir al usuario modificar la cantidad de mensajes a mostrar por página.

:white_check_mark: Bloquear el cambio de pagina al estar en la primera.

:white_square_button: Bloquear el cambio de pagina al estar en la última.

:pushpin: Sesión.

:white_check_mark: Mantener sesión activa.

:white_check_mark: Renovar sesión.

:pushpin: Vista detalle del correo.

:white_square_button: Detalle.

:white_check_mark: Obtener información del mensaje.

:white_check_mark: Obtener archivos adjuntos del mensaje.

:white_check_mark: Descargar archivos adjuntos del mensaje.

:white_square_button: Editor de texto.

:white_square_button: Reenviar correo.

:pushpin: Otros.

:white_check_mark: Implementar variables de entorno.

:white_check_mark: Remover credenciales innecesarias (API_KEY).

:white_square_button: Soporte para dispositivos móviles.