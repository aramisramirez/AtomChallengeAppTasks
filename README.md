> **💡 Nota:**  
> Para instalar los paquetes de Node, usa:
>
> ```sh
> npm install
> ```

> **⚠️ Importante:**  
> Asegúrate de tener las siguientes versiones de Node y npm para evitar problemas:
>
> - **Node:** `23.6.0`
> - **NPM:** `10.9.2`

> **💡 Consejos:**  
> Comandos de ejecución del proyecto:
>
> ```sh
> firebase emulators:start --only functions      # Para ejecutar el proyecto
> npm run build     # Para generar un compilado que sirve para refrescar los cambios de typescript y convertirlos a javascript
> firebase deploy --only functions     #Para desplegar el proyecto
> ```
>
> **💡 Obsevaciones:**

Esto es el backend de la aplicación de tareas. Aparte de la funcionalidad necesaria que detallaron en el documento de prueba técnica, usar firestore como base de datos y desplegar el backend en cloud functions se implemento filtros de busqueda de tareas como buscar por fecha inicio y fecha fin y buscar por el titulo. Ademas de eso se implemento la seguridad del sistema usando jwt y validación de token en los enpoints de tareas. Esto se añadio como toque adicional a lo pedido por la prueba 🚀
