export type Lang = 'es' | 'en'
export type Theme = 'light' | 'dark'

export const DEFAULT_LANG: Lang = 'es'
export const DEFAULT_THEME: Theme = 'light'
export const LANG_COOKIE = 'coco-lang'
export const THEME_COOKIE = 'coco-theme-session'
export const LOCALES: Record<Lang, string> = { es: 'es-CO', en: 'en-US' }

const es = {
  brand: {
    tagline: 'Observa. Registra. Cuida.',
    short: 'COCO no diagnostica enfermedades.',
    long: 'COCO no diagnostica enfermedades ni reemplaza al médico veterinario.',
    hero: 'Reconoce a tiempo los cambios en la rutina de tu conejo.',
    full: 'Cuaderno de Observación y Cuidado Oportuno',
  },
  nav: {
    label: 'Navegación principal', home: 'Inicio', history: 'Historial', trends: 'Tendencias', analysis: 'Análisis',
    profile: 'Perfil', reminders: 'Recordatorios', sync: 'Sincronización', settings: 'Configuración', logout: 'Cerrar sesión',
  },
  habits: { FOOD: 'Alimentación', WATER: 'Agua', SLEEP: 'Sueño', PLAY: 'Juego', BEHAVIOR: 'Comportamiento' },
  units: { g: 'g', ml: 'ml', min: 'min', nota: 'nota' } as Record<string, string>,
  recordStatus: { SYNCED: 'Sincronizado', PENDING: 'Pendiente', FAILED: 'Error', DUPLICATE: 'Duplicado' },
  recordStatusLabel: 'Estado',
  syncState: {
    idle: 'Sin cambios pendientes', syncing: 'Sincronizando…', synced: 'Sincronizado',
    partial: 'Sincronización parcial', failed: 'No se pudo sincronizar', offline: 'Sin conexión',
  },
  common: {
    loading: 'Cargando…', close: 'Cerrar', all: 'Todas', today: 'Hoy', processing: 'Procesando…', noValue: '—',
    previous: 'Anterior', next: 'Siguiente', view: 'Ver', done: 'Listo', save: 'Guardar',
  },
  dashboard: {
    title: 'Panel de inicio', metaTitle: 'Inicio', todayHabits: 'Resumen de hábitos de hoy', habitsHeading: 'Resumen de hábitos',
    recent: 'Registros recientes', chartTitle: 'Actividad de los últimos 7 días', chartSub: 'Observaciones registradas por variable.',
    syncLabel: 'Datos cargados desde tu cuenta', noRecordsToday: 'Sin registros hoy', rabbitSelect: 'Seleccionar conejo',
  },
  hero: {
    hello: 'Hola', rabbitLine: (name: string) => `Así va la rutina de ${name}`, noRabbit: 'Registra a tu conejo para empezar',
    sub: 'Observaciones propias de tu conejo, sin diagnósticos.', summary: 'Resumen de bienvenida',
    week: 'Registros 7 días', variables: 'Variables vistas', of5: (n: number) => `${n} de 5`, last: 'Último registro', none: 'Sin registros',
  },
  records: {
    table: 'Registros recientes', variable: 'Variable', value: 'Valor', note: 'Nota', date: 'Fecha', status: 'Estado',
    empty: 'No hay registros para mostrar.',
  },
  createRabbit: {
    title: 'Asocia tu primer conejo', text: 'El conejo quedará asociado automáticamente a tu cuenta.',
    placeholder: 'Nombre del conejo', saving: 'Guardando…', create: 'Crear conejo', saveError: 'No se pudo guardar el conejo.',
  },
  auth: {
    login: 'Iniciar sesión', register: 'Crear cuenta', name: 'Nombre visible', email: 'Correo electrónico', password: 'Contraseña',
    processing: 'Procesando…', noAccount: '¿No tienes cuenta?', signUp: 'Regístrate', haveAccount: '¿Ya tienes cuenta?', signIn: 'Inicia sesión',
    requestError: 'No se pudo completar la solicitud.', connectError: 'No fue posible conectar con COCO.',
    hello: 'Hola', createSub: 'Crea tu cuenta', loginMeta: 'Iniciar sesión', registerMeta: 'Crear cuenta',
    welcome: 'Bienvenido', loginSub: 'Ingresa tus credenciales para acceder a COCO', emailPh: 'tu@email.com', passwordPh: '••••••••',
    createTitle: 'Crear cuenta', createLead: 'Completa los campos para comenzar', namePh: 'Tu nombre', nameHint: 'Máximo 100 caracteres',
    emailHint: 'Usaremos este correo para tu cuenta', passwordHint: 'Mínimo 8 caracteres', confirm: 'Confirmar contraseña',
    confirmHint: 'Debe coincidir con la contraseña anterior', mismatch: 'Las contraseñas no coinciden.',
    errName: 'Escribe tu nombre.', errNameLong: 'El nombre no puede superar 100 caracteres.',
    errEmail: 'Escribe tu correo electrónico.', errEmailFormat: 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    errPassword: 'Escribe tu contraseña.', errPasswordShort: 'La contraseña debe tener al menos 8 caracteres.',
    errConfirm: 'Confirma tu contraseña.',
    show: 'Mostrar contraseña', hide: 'Ocultar contraseña', joinTitle: 'Únete a COCO',
    joinText: 'Registra la alimentación, el agua, el sueño y el comportamiento de tu conejo y detecta cambios a tiempo.',
    joinFeature: 'Observación preventiva diaria',
  },
  history: {
    title: 'Historial', sub: 'Filtra y consulta las observaciones de Coquito.',
    filters: 'Filtros del historial', variable: 'Variable', period: 'Periodo', recordType: 'Tipo de registro', from: 'Desde', to: 'Hasta',
    last7: 'Últimos 7 días', last30: 'Últimos 30 días', allHistory: 'Todo el historial', custom: 'Rango personalizado',
    watch: 'Smartwatch', web: 'Plataforma web', webShort: 'Web', all: 'Todos', search: 'Buscar en notas de comportamiento',
    searchPlaceholder: 'Ej. tranquilo, juego…', date: 'Fecha', valueNote: 'Valor / nota', origin: 'Origen', detail: 'Detalle',
    loading: 'Cargando historial…', empty: 'No hay registros que coincidan con estos filtros.',
    summary: (n: number, p: number, total: number) => `${n} registros · página ${p} de ${total}`,
    detailTitle: 'Detalle del registro', closeDetail: 'Cerrar detalle', sync: 'Sincronización', value: 'Valor',
  },
  trends: {
    title: 'Tendencias', sub: 'Compara las observaciones registradas en el tiempo.', variables: 'Variables', period: 'Periodo',
    days7: '7 días', days30: '30 días', custom: 'Personalizado', from: 'Desde', to: 'Hasta',
    pickOne: 'Selecciona al menos una variable para ver sus registros.',
    q1: '¿Qué ocurrió?', a1: 'La gráfica cuenta observaciones por día y variable.',
    q2: '¿Qué cambió?', a2: 'Compara los días visibles para encontrar variaciones registradas.',
    q3: 'Contexto', a3: 'Patrón ilustrativo construido con datos demo; no equivale a una evaluación clínica.',
    legend1: '— Observaciones registradas', legend2: 'Patrón habitual simulado: referencia demo', legend3: 'Los cambios dependen de los registros disponibles',
    chartAria: 'Gráfica de registros diarios por variable', pattern: 'patrón demo',
  },
  analysis: {
    title: 'Análisis observado', sub: 'Una lectura descriptiva de los registros recientes de tu conejo.',
    disclaimer: 'COCO es una herramienta de observación preventiva. No diagnostica enfermedades ni reemplaza al médico veterinario.',
    preparing: 'Preparando el análisis…', factors: 'Factores considerados', recommendation: 'Recomendación preventiva',
    vet: 'Las observaciones sugieren buscar orientación veterinaria. Este resultado no es un diagnóstico.',
    error: 'No fue posible generar el resumen. Inténtalo de nuevo más tarde.', generated: 'Generado',
    fromBackend: 'Análisis del backend', fromMock: 'Resultado demo de respaldo',
    status: { NORMAL: 'Observación normal', ATTENTION: 'Revisar observaciones', HIGH_ATTENTION: 'Requiere atención', LEARNING: 'Aprendiendo la rutina' },
    mock: {
      enough: 'Hay registros recientes para describir la rutina; este resultado de demostración no analiza cambios clínicos.',
      few: 'Aún hay pocos registros para describir una tendencia con claridad.',
      factorsEnough: (records: number, days: number, vars: number) => [`${records} observaciones en ${days} días`, `${vars} variables con seguimiento`],
      factorsFew: ['Registra observaciones en varios días', 'La falta de registros no significa que la actividad no ocurrió'],
      recommendation: 'Continúa registrando observaciones y consulta a un veterinario ante una preocupación.',
    },
  },
  profile: {
    title: 'Perfil', sub: 'Información del compañero que estás observando.', active: 'Conejo activo', none: 'Sin conejo asociado',
    demo: 'Perfil demo · Observaciones almacenadas localmente.', about: 'Acerca de COCO',
    aboutText: 'Cuaderno de Observación y Cuidado Oportuno. Registra hábitos para reconocer cambios en la rutina. El perfil se administra localmente durante esta etapa de demostración.',
  },
  reminders: {
    title: 'Recordatorios', sub: 'Ajusta avisos locales para acompañar la rutina de cuidado.',
    note: 'Estos ajustes son una demostración en esta sesión. Las notificaciones del sistema no están conectadas.',
    enable: 'Activar', disable: 'Desactivar',
    items: {
      food: { title: 'Revisar alimentación', detail: 'Anota la ración de la mañana' },
      water: { title: 'Revisar agua', detail: 'Comprueba el bebedero' },
      evening: { title: 'Resumen del día', detail: 'Completa las observaciones pendientes' },
    } as Record<string, { title: string; detail: string }>,
  },
  sync: {
    title: 'Sincronización', sub: 'Estado de los registros que llegaron al servidor.', api: 'API', connected: 'Conectada',
    onServer: 'Registros en servidor', failed: 'Fallidos reportados', queue: 'Cola local del reloj',
    queueText: 'Los registros pendientes permanecen en Room y se reintentan desde Wear OS. El servidor no puede consultar la cola local del dispositivo.',
  },
  settings: {
    title: 'Configuración', sub: 'Preferencias de visualización y privacidad.',
    language: 'Idioma', languageHelp: 'Cambia el idioma de toda la plataforma.', spanish: 'Español', english: 'English',
    theme: 'Tema', themeHelp: 'El modo claro es el predeterminado.', light: 'Claro', dark: 'Oscuro',
    compact: 'Vista compacta', compactHelp: 'Reduce el espacio entre tarjetas.',
    reminders: 'Recordatorios', remindersHelp: 'Preferencia local para avisos de cuidado.',
    demoData: 'Datos demo',
    demoDataText: 'Los datos de esta versión se generan desde repositorios mock locales. No se envían credenciales ni observaciones a un proveedor externo.',
    appearance: 'Apariencia',
  },
}

export type Dictionary = typeof es

const en: Dictionary = {
  brand: {
    tagline: 'Observe. Record. Care.',
    short: 'COCO does not diagnose diseases.',
    long: 'COCO does not diagnose diseases or replace a veterinarian.',
    hero: "Spot changes in your rabbit's routine in time.",
    full: 'Observation and Timely Care Notebook',
  },
  nav: {
    label: 'Main navigation', home: 'Home', history: 'History', trends: 'Trends', analysis: 'Analysis',
    profile: 'Profile', reminders: 'Reminders', sync: 'Synchronization', settings: 'Settings', logout: 'Log out',
  },
  habits: { FOOD: 'Feeding', WATER: 'Water', SLEEP: 'Sleep', PLAY: 'Play', BEHAVIOR: 'Behavior' },
  units: { g: 'g', ml: 'ml', min: 'min', nota: 'note' },
  recordStatus: { SYNCED: 'Synced', PENDING: 'Pending', FAILED: 'Error', DUPLICATE: 'Duplicate' },
  recordStatusLabel: 'Status',
  syncState: {
    idle: 'No pending changes', syncing: 'Syncing…', synced: 'Synced',
    partial: 'Partial sync', failed: 'Could not sync', offline: 'Offline',
  },
  common: {
    loading: 'Loading…', close: 'Close', all: 'All', today: 'Today', processing: 'Processing…', noValue: '—',
    previous: 'Previous', next: 'Next', view: 'View', done: 'Done', save: 'Save',
  },
  dashboard: {
    title: 'Home panel', metaTitle: 'Home', todayHabits: "Today's habit summary", habitsHeading: 'Habit summary',
    recent: 'Recent records', chartTitle: 'Activity over the last 7 days', chartSub: 'Observations recorded per variable.',
    syncLabel: 'Data loaded from your account', noRecordsToday: 'No records today', rabbitSelect: 'Select rabbit',
  },
  hero: {
    hello: 'Hello', rabbitLine: (name: string) => `This is how ${name}'s routine is going`, noRabbit: 'Add your rabbit to get started',
    sub: "Observations about your own rabbit, no diagnoses.", summary: 'Welcome summary',
    week: 'Records, 7 days', variables: 'Variables seen', of5: (n: number) => `${n} of 5`, last: 'Last record', none: 'No records',
  },
  records: {
    table: 'Recent records', variable: 'Variable', value: 'Value', note: 'Note', date: 'Date', status: 'Status',
    empty: 'There are no records to show.',
  },
  createRabbit: {
    title: 'Add your first rabbit', text: 'The rabbit will be linked to your account automatically.',
    placeholder: "Rabbit's name", saving: 'Saving…', create: 'Create rabbit', saveError: 'The rabbit could not be saved.',
  },
  auth: {
    login: 'Log in', register: 'Create account', name: 'Display name', email: 'Email address', password: 'Password',
    processing: 'Processing…', noAccount: "Don't have an account?", signUp: 'Sign up', haveAccount: 'Already have an account?', signIn: 'Log in',
    requestError: 'The request could not be completed.', connectError: 'Could not connect to COCO.',
    hello: 'Hello', createSub: 'Create your account', loginMeta: 'Log in', registerMeta: 'Create account',
    welcome: 'Welcome', loginSub: 'Enter your credentials to access COCO', emailPh: 'you@email.com', passwordPh: '••••••••',
    createTitle: 'Create account', createLead: 'Fill in the fields to get started', namePh: 'Your name', nameHint: 'Maximum 100 characters',
    emailHint: "We'll use this email for your account", passwordHint: 'At least 8 characters', confirm: 'Confirm password',
    confirmHint: 'Must match the previous password', mismatch: 'Passwords do not match.',
    errName: 'Enter your name.', errNameLong: 'The name cannot exceed 100 characters.',
    errEmail: 'Enter your email address.', errEmailFormat: 'Enter a valid email, for example name@mail.com.',
    errPassword: 'Enter your password.', errPasswordShort: 'The password must be at least 8 characters long.',
    errConfirm: 'Confirm your password.',
    show: 'Show password', hide: 'Hide password', joinTitle: 'Join COCO',
    joinText: "Log your rabbit's food, water, sleep and behavior and spot changes in time.",
    joinFeature: 'Daily preventive observation',
  },
  history: {
    title: 'History', sub: "Filter and browse Coquito's observations.",
    filters: 'History filters', variable: 'Variable', period: 'Period', recordType: 'Record type', from: 'From', to: 'To',
    last7: 'Last 7 days', last30: 'Last 30 days', allHistory: 'Full history', custom: 'Custom range',
    watch: 'Smartwatch', web: 'Web platform', webShort: 'Web', all: 'All', search: 'Search behavior notes',
    searchPlaceholder: 'E.g. calm, play…', date: 'Date', valueNote: 'Value / note', origin: 'Source', detail: 'Details',
    loading: 'Loading history…', empty: 'No records match these filters.',
    summary: (n: number, p: number, total: number) => `${n} records · page ${p} of ${total}`,
    detailTitle: 'Record details', closeDetail: 'Close details', sync: 'Sync', value: 'Value',
  },
  trends: {
    title: 'Trends', sub: 'Compare the observations recorded over time.', variables: 'Variables', period: 'Period',
    days7: '7 days', days30: '30 days', custom: 'Custom', from: 'From', to: 'To',
    pickOne: 'Select at least one variable to see its records.',
    q1: 'What happened?', a1: 'The chart counts observations per day and variable.',
    q2: 'What changed?', a2: 'Compare the visible days to find recorded variations.',
    q3: 'Context', a3: 'Illustrative pattern built from demo data; it is not a clinical assessment.',
    legend1: '— Recorded observations', legend2: 'Simulated usual pattern: demo reference', legend3: 'Changes depend on the available records',
    chartAria: 'Chart of daily records per variable', pattern: 'demo pattern',
  },
  analysis: {
    title: 'Observed analysis', sub: "A descriptive reading of your rabbit's recent records.",
    disclaimer: 'COCO is a preventive observation tool. It does not diagnose diseases or replace a veterinarian.',
    preparing: 'Preparing the analysis…', factors: 'Factors considered', recommendation: 'Preventive recommendation',
    vet: 'The observations suggest seeking veterinary guidance. This result is not a diagnosis.',
    error: 'The summary could not be generated. Please try again later.', generated: 'Generated',
    fromBackend: 'Backend analysis', fromMock: 'Demo fallback result',
    status: { NORMAL: 'Normal observation', ATTENTION: 'Review observations', HIGH_ATTENTION: 'Needs attention', LEARNING: 'Learning the routine' },
    mock: {
      enough: 'There are recent records to describe the routine; this demo result does not analyze clinical changes.',
      few: 'There are still too few records to describe a trend clearly.',
      factorsEnough: (records: number, days: number, vars: number) => [`${records} observations in ${days} days`, `${vars} variables being tracked`],
      factorsFew: ['Record observations on several days', 'Missing records do not mean the activity did not happen'],
      recommendation: 'Keep recording observations and consult a veterinarian if you are concerned.',
    },
  },
  profile: {
    title: 'Profile', sub: "Information about the companion you're observing.", active: 'Active rabbit', none: 'No rabbit linked',
    demo: 'Demo profile · Observations stored locally.', about: 'About COCO',
    aboutText: 'Observation and Timely Care Notebook. Record habits to recognize changes in the routine. The profile is managed locally during this demo stage.',
  },
  reminders: {
    title: 'Reminders', sub: 'Adjust local alerts to support the care routine.',
    note: 'These settings are a demo for this session. System notifications are not connected.',
    enable: 'Enable', disable: 'Disable',
    items: {
      food: { title: 'Check feeding', detail: "Note this morning's portion" },
      water: { title: 'Check water', detail: 'Check the water bottle' },
      evening: { title: 'Daily summary', detail: 'Complete the pending observations' },
    },
  },
  sync: {
    title: 'Synchronization', sub: 'Status of the records that reached the server.', api: 'API', connected: 'Connected',
    onServer: 'Records on server', failed: 'Reported failures', queue: "Watch's local queue",
    queueText: "Pending records stay in Room and are retried from Wear OS. The server cannot read the device's local queue.",
  },
  settings: {
    title: 'Settings', sub: 'Display and privacy preferences.',
    language: 'Language', languageHelp: 'Changes the language of the whole platform.', spanish: 'Español', english: 'English',
    theme: 'Theme', themeHelp: 'Light mode is the default.', light: 'Light', dark: 'Dark',
    compact: 'Compact view', compactHelp: 'Reduces the space between cards.',
    reminders: 'Reminders', remindersHelp: 'Local preference for care alerts.',
    demoData: 'Demo data',
    demoDataText: 'Data in this version comes from local mock repositories. No credentials or observations are sent to an external provider.',
    appearance: 'Appearance',
  },
}

export const dictionaries: Record<Lang, Dictionary> = { es, en }

export function normalizeLang(value: string | undefined | null): Lang { return value === 'en' ? 'en' : 'es' }
export function normalizeTheme(value: string | undefined | null): Theme { return value === 'dark' ? 'dark' : 'light' }
