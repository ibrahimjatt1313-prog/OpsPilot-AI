# OpsPilot AI - Enterprise SRE Edition (Pruv Version)

Documentación técnica de las mejoras de arquitectura, rediseño completo de UI/UX y desacoplamiento de servicios aplicados al proyecto para el **AI Infrastructure Hackathon**.

---

## 📌 Tabla de Contenidos
1. [Resumen General](#resumen-general)
2. [Rediseño Completo de Interfaz y Experiencia de Usuario (UI/UX)](#rediseño-completo-de-uiux)
3. [Desacoplamiento y Modularización del Backend (API REST)](#desacoplamiento-del-backend)
4. [Integración Cloud con Gemini 3.6 Flash (Bajo Consumo)](#integración-cloud-con-gemini)
5. [Motor Heurístico de Resiliencia Zero-Fail (Hackathon Ready)](#motor-heurístico-zero-fail)
6. [Guía de Ejecución y Despliegue](#guía-de-ejecución)

---

## 1. Resumen General

Se transformó la aplicación desde un prototipo monolítico a una plataforma empresarial de **Inteligencia Operacional para Site Reliability Engineering (SRE)**:
- **Frontend desacoplado y reactivo**: React + Vite con diseño moderno *Light Enterprise*.
- **Backend modular en capas**: API REST en Node.js/Express con separación de rutas, controladores y servicios.
- **Inferencia en la nube**: Integración con modelos de última generación de Google Gemini (`gemini-3.6-flash`) para evitar errores de versiones deprecadas y garantizar cero consumo local de CPU/RAM.
- **Garantía Zero-Fail**: Sistema de contingencia heurístico para demostraciones en vivo sin riesgo de caídas por conectividad o cuota de API.

---

## 2. Rediseño Completo de UI/UX

La interfaz fue reconstruida desde cero basada en los lineamientos visuales de la versión Enterprise SRE:

### A. Sidebar Lateral Izquierdo
- **Identidad de Marca**: Isotipo de chip azul con título `OpsPilot AI` y subtítulo `ENTERPRISE SRE`.
- **Menú de Navegación**: Enlaces interactivos a `Dashboard`, `Diagnostics Workspace`, `Incident Audit Trail` y `Model Engine Settings`.
- **Card SRE Sentinel**: Indicador de seguridad activo `TLS 1.3 Encryption Active` con escudo verde.
- **Perfil de Administrador**: Datos del operador responsable (`Alex Thorne - Lead Infrastructure`).

### B. Header Superior
- **Indicador SLA**: Badge en pill verde `● Optimal 99.4% SLA`.
- **Selector de Región**: Selector de clústeres globales (`US East`, `US West`, `EU Central`, etc.).
- **Accesos Rápidos**: Botones de apertura rápida para `Cluster Telemetry` y `Zero Trust`.

### C. Métricas Clave (KPI Strip)
- **Analyses Executed**: Contador de diagnósticos ejecutados (`9,484` microservicios).
- **Avg MTTR Reduction**: Tiempo medio de recuperación (`14.2m` con -84% de reducción).
- **Uptime SLA Verified**: Disponibilidad garantizada (`99.99%`).

### D. Flujo de Operación del Motor ("How the AI Works")
- Visualización de 4 etapas consecutivas:
  1. **Situation**: Ingesta de telemetría y logs.
  2. **AI Reasoning**: Identificación de estados anómalos.
  3. **Risk Assessment**: Evaluación de riesgo y ventana MTTR.
  4. **Remediation**: Despacho de tareas de mitigación.

### E. Workspace de Diagnóstico (2 Columnas)
- **Ingesta de Incidentes**: Textarea optimizada con presets rápidos (`DB Lock Timeout`, `K8s OOM Loop`, `Redis Exhaustion`) y botón `Execute Autonomous SRE Diagnosis`.
- **Panel de Salida Estructurada**:
  - Indicador de confianza del modelo (`98%`).
  - Badges de severidad: `RISK LEVEL: High Priority` (rojo) y `EST. RECOVERY: 20-35 Minutes` (ámbar).
  - Resumen de situación técnica (`Situation Summary`).
  - Evaluación de causa raíz (`Root Cause Assessment`).

### F. Plan de Mitigación Recomendado
- Tarjeta de acciones secuenciales escalonadas por tiempo:
  - **Immediate**: Mitigaciones de contención inmediata (SRE).
  - **Short-Term**: Estabilización de recursos y pools de conexiones (DBA).
  - **Long-Term**: Corrección arquitectónica y disyuntores (*circuit breakers*).

### G. Historial de Incidentes (Audit Trail)
- Buscador reactivo en tiempo real para filtrar incidentes por palabras clave.
- Badges de criticidad (`CRITICAL` / `WARNING`).
- Carga instantánea de incidentes históricos al hacer clic.

### H. Modals Detallados
1. **Cluster Telemetry Insights**:
   - Tarjetas de métricas: `TOTAL SPANS (9484)`, `ACTIVE INCIDENTS (3 Critical)`, `SLA HEALTH (99.4%)`.
   - Stream de logs en tiempo real (`REALTIME TELEMETRY STREAM`) con niveles `INFO`, `WARN` y `SUCCESS`.
   - Pie con indicador `Encrypted pipeline` y botón de cierre.
2. **Zero-Trust Security & Compliance**:
   - Banner de certificación `SOC2 Type II Certified & ISO 27001 Compliant`.
   - Especificaciones técnicas: cifrado `TLS 1.3 / AES-256-GCM` y shard `us-east-1`.
   - Pie con indicador `ISO Certification Active` y botón de cierre.

---

## 3. Desacoplamiento del Backend (API REST)

Se estructuró una API modular en la carpeta [`server/`](./server) corriendo en el puerto `5000`, conectada al frontend mediante el proxy inverso de Vite (`/api/*`):

| Endpoint | Método | Función |
| :--- | :--- | :--- |
| `/api/diagnostics/analyze` | `POST` | Procesa logs de contenedores y bases de datos vía Gemini Cloud o motor heurístico. |
| `/api/telemetry/stream` | `GET` | Provee el feed de eventos y logs en vivo de los nodos del clúster. |
| `/api/telemetry/metrics` | `GET` | Entrega métricas de SLA, escaneos y tiempos MTTR. |
| `/api/incidents` | `GET` / `POST` | Consulta y almacenamiento del historial de auditoría de incidentes. |
| `/api/health` | `GET` | Estado del backend y comprobación de configuración de la IA. |

---

## 4. Integración Cloud con Gemini 3.6 Flash

- **Compatibilidad de API**: Se actualizó la integración con el SDK `@google/genai` configurando como modelo base **`gemini-3.6-flash`** (con fallback a `gemini-3.5-flash`), evitando errores `400 Bad Request` producidos por versiones deprecadas (2.5 o inferiores).
- **Cero Consumo Local**: La inferencia se realiza 100% en los servidores de Google Cloud, sin demandar procesamiento de CPU ni memoria RAM en la máquina de desarrollo.
- **Especialización en Infraestructura (SRE)**: El prompt del sistema está afinado para detectar firmas de error críticas:
  - **Kubernetes**: `OOMKilled` (Exit 137), `CrashLoopBackOff`, `ImagePullBackOff`, `NodeNotReady`, fallos de probes.
  - **Docker**: Terminación forzada de contenedores, conflictos de puertos, fallos de sockets.
  - **Bases de datos**: Bloqueos (`deadlocks`), `lock timeout` en PostgreSQL/MySQL, saturación de pools de conexiones y agotamiento de memoria en Redis (`maxmemory`).

---

## 5. Motor Heurístico Zero-Fail (Hackathon Ready)

Para asegurar el éxito de las demostraciones en vivo ante jurados:
- Si el backend no cuenta con una API key configurada o si la red presenta cortes o límites de cuota, el archivo [`server/services/mockService.js`](./server/services/mockService.js) entra en acción de forma transparente.
- Analiza determinísticamente las firmas del log ingresado y genera diagnósticos ultra-realistas en menos de **20 milisegundos**.
- La aplicación **nunca arroja error 500 ni interrumpe la demo**, demostrando un diseño con *Graceful Degradation*.

---

## 6. Guía de Ejecución

### Prerrequisitos
- Node.js (v18 o superior)
- npm

### 1. Iniciar el Backend API
```bash
cd server
npm install
node index.js
# Servidor escuchando en http://localhost:5000
```

*(Opcional: configurar API key en `.env`)*:
```env
GEMINI_API_KEY=tu_api_key_de_google_ai_studio
GEMINI_MODEL=gemini-3.6-flash
PORT=5000
```

### 2. Iniciar el Frontend Dashboard
```bash
# En la raíz del repositorio
npm install
npm run dev
# Dashboard disponible en http://localhost:5173
```
