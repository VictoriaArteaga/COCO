# Integración futura de análisis

**Actual:** `AnalysisService` delega a la interfaz `AnalysisProvider`; `MockAnalysisProvider` devuelve una observación estructurada con periodo, factores y metadatos demo. Ningún proveedor externo o modelo está conectado.

**Futuro:** implementar un adaptador `AIAnalysisProvider` detrás de `AnalysisProvider`, configurado por variables de entorno del servidor. Las pantallas reciben el mismo `AnalysisResult` y no deben conocer al proveedor. Las salidas deben ser preventivas, explicables y no diagnósticas. COCO no será un chatbot.

El porcentaje mostrado actualmente describe completitud ilustrativa del conjunto de datos y no confianza clínica.
