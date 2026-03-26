export const translations = {
  en: {
    // App
    title: 'Will my flight be delayed?',
    subtitle: 'Historical delay odds based on the last 90 days',
    noApiKey: 'No VITE_AERODATABOX_KEY set. Add your',
    noApiKeyLink: 'RapidAPI AeroDataBox',
    noApiKeySuffix: 'key to .env.local',
    changeLink: '← Change',

    // Search
    searchPlaceholder: 'Flight number — e.g. AA123',
    searchButton: 'Search',
    noFlightsFound: 'No flights found for',
    searchAgain: 'Search again',

    // Results
    noData: 'Not enough historical data to compute delay odds for this flight.',
    tryAnother: 'Try another flight',
    cached: 'Cached',
    refresh: 'Refresh',

    // Gauge
    delayChance: 'delay chance',
    lookingGood: 'Looking good',
    moderateRisk: 'Moderate risk',
    highRisk: 'High risk',

    // Breakdown
    onTime: 'On time',
    minorDelay: 'Minor delay',
    moderate: 'Moderate',
    severe: 'Severe',
    cancelled: 'Cancelled',
    basedOn: 'Based on',
    flights: 'flights',
    last90: 'last 90 days',

    // Live
    live: 'Live',
    noLiveData: 'No live data found',
    onGround: 'On ground',
    airborne: 'Airborne',

    // Recent
    recent: 'Recent',
    clearAll: 'Clear all',

    // Footer
    dataSource: 'Data: AeroDataBox · OpenSky Network',
    liveRefresh: 'Live positions refresh every 30s',
    donate: 'Buy me a coffee',
  },

  pl: {
    title: 'Czy mój lot będzie opóźniony?',
    subtitle: 'Statystyki opóźnień z ostatnich 90 dni',
    noApiKey: 'Brak klucza VITE_AERODATABOX_KEY. Dodaj swój',
    noApiKeyLink: 'klucz RapidAPI AeroDataBox',
    noApiKeySuffix: 'do pliku .env.local',
    changeLink: '← Zmień',

    searchPlaceholder: 'Numer lotu — np. AA123',
    searchButton: 'Szukaj',
    noFlightsFound: 'Nie znaleziono lotów dla',
    searchAgain: 'Szukaj ponownie',

    noData: 'Brak wystarczających danych historycznych do obliczenia prawdopodobieństwa opóźnienia.',
    tryAnother: 'Spróbuj innego lotu',
    cached: 'Z cache',
    refresh: 'Odśwież',

    delayChance: 'szansa opóźnienia',
    lookingGood: 'Wygląda dobrze',
    moderateRisk: 'Umiarkowane ryzyko',
    highRisk: 'Wysokie ryzyko',

    onTime: 'Na czas',
    minorDelay: 'Małe opóźnienie',
    moderate: 'Umiarkowane',
    severe: 'Duże',
    cancelled: 'Odwołany',
    basedOn: 'Na podstawie',
    flights: 'lotów',
    last90: 'ostatnie 90 dni',

    live: 'Na żywo',
    noLiveData: 'Brak danych na żywo',
    onGround: 'Na ziemi',
    airborne: 'W powietrzu',

    recent: 'Ostatnie',
    clearAll: 'Wyczyść',

    dataSource: 'Dane: AeroDataBox · OpenSky Network',
    liveRefresh: 'Pozycja na żywo co 30s',
    donate: 'Postaw mi kawę',
  },

  de: {
    title: 'Wird mein Flug verspätet?',
    subtitle: 'Historische Verspätungswahrscheinlichkeit der letzten 90 Tage',
    noApiKey: 'Kein VITE_AERODATABOX_KEY gesetzt. Füge deinen',
    noApiKeyLink: 'RapidAPI AeroDataBox-Schlüssel',
    noApiKeySuffix: 'in .env.local hinzu',
    changeLink: '← Ändern',

    searchPlaceholder: 'Flugnummer — z.B. AA123',
    searchButton: 'Suchen',
    noFlightsFound: 'Keine Flüge gefunden für',
    searchAgain: 'Erneut suchen',

    noData: 'Nicht genügend historische Daten für diese Flugnummer vorhanden.',
    tryAnother: 'Anderen Flug versuchen',
    cached: 'Gecacht',
    refresh: 'Aktualisieren',

    delayChance: 'Verspätungsrisiko',
    lookingGood: 'Sieht gut aus',
    moderateRisk: 'Mäßiges Risiko',
    highRisk: 'Hohes Risiko',

    onTime: 'Pünktlich',
    minorDelay: 'Kleine Verspätung',
    moderate: 'Mäßig',
    severe: 'Stark',
    cancelled: 'Storniert',
    basedOn: 'Basierend auf',
    flights: 'Flügen',
    last90: 'letzte 90 Tage',

    live: 'Live',
    noLiveData: 'Keine Live-Daten',
    onGround: 'Am Boden',
    airborne: 'In der Luft',

    recent: 'Zuletzt',
    clearAll: 'Alle löschen',

    dataSource: 'Daten: AeroDataBox · OpenSky Network',
    liveRefresh: 'Live-Position alle 30s',
    donate: 'Kauf mir einen Kaffee',
  },

  fr: {
    title: 'Mon vol sera-t-il retardé ?',
    subtitle: 'Probabilité de retard basée sur les 90 derniers jours',
    noApiKey: 'Clé VITE_AERODATABOX_KEY manquante. Ajoutez votre',
    noApiKeyLink: 'clé RapidAPI AeroDataBox',
    noApiKeySuffix: 'dans .env.local',
    changeLink: '← Modifier',

    searchPlaceholder: 'Numéro de vol — ex. AA123',
    searchButton: 'Rechercher',
    noFlightsFound: 'Aucun vol trouvé pour',
    searchAgain: 'Rechercher à nouveau',

    noData: "Pas assez de données historiques pour calculer les probabilités de retard.",
    tryAnother: 'Essayer un autre vol',
    cached: 'En cache',
    refresh: 'Actualiser',

    delayChance: 'risque de retard',
    lookingGood: 'Ça semble bon',
    moderateRisk: 'Risque modéré',
    highRisk: 'Risque élevé',

    onTime: "À l'heure",
    minorDelay: 'Léger retard',
    moderate: 'Modéré',
    severe: 'Important',
    cancelled: 'Annulé',
    basedOn: 'Basé sur',
    flights: 'vols',
    last90: '90 derniers jours',

    live: 'En direct',
    noLiveData: 'Pas de données en direct',
    onGround: 'Au sol',
    airborne: 'En vol',

    recent: 'Récents',
    clearAll: 'Tout effacer',

    dataSource: 'Données : AeroDataBox · OpenSky Network',
    liveRefresh: 'Position en direct toutes les 30s',
    donate: 'Offrez-moi un café',
  },

  ru: {
    title: 'Задержат ли мой рейс?',
    subtitle: 'Статистика задержек за последние 90 дней',
    noApiKey: 'Ключ VITE_AERODATABOX_KEY не задан. Добавьте',
    noApiKeyLink: 'ключ RapidAPI AeroDataBox',
    noApiKeySuffix: 'в файл .env.local',
    changeLink: '← Изменить',

    searchPlaceholder: 'Номер рейса — напр. AA123',
    searchButton: 'Найти',
    noFlightsFound: 'Рейсы не найдены для',
    searchAgain: 'Искать снова',

    noData: 'Недостаточно исторических данных для расчёта вероятности задержки.',
    tryAnother: 'Попробовать другой рейс',
    cached: 'Из кэша',
    refresh: 'Обновить',

    delayChance: 'вероятность задержки',
    lookingGood: 'Всё хорошо',
    moderateRisk: 'Умеренный риск',
    highRisk: 'Высокий риск',

    onTime: 'Вовремя',
    minorDelay: 'Малая задержка',
    moderate: 'Умеренная',
    severe: 'Большая',
    cancelled: 'Отменён',
    basedOn: 'На основе',
    flights: 'рейсов',
    last90: 'последние 90 дней',

    live: 'Live',
    noLiveData: 'Нет данных в реальном времени',
    onGround: 'На земле',
    airborne: 'В воздухе',

    recent: 'Недавние',
    clearAll: 'Очистить',

    dataSource: 'Данные: AeroDataBox · OpenSky Network',
    liveRefresh: 'Позиция обновляется каждые 30с',
    donate: 'Угостить кофе',
  },

  es: {
    title: '¿Se retrasará mi vuelo?',
    subtitle: 'Probabilidad de retraso basada en los últimos 90 días',
    noApiKey: 'Falta VITE_AERODATABOX_KEY. Añade tu',
    noApiKeyLink: 'clave RapidAPI AeroDataBox',
    noApiKeySuffix: 'en .env.local',
    changeLink: '← Cambiar',

    searchPlaceholder: 'Número de vuelo — ej. AA123',
    searchButton: 'Buscar',
    noFlightsFound: 'No se encontraron vuelos para',
    searchAgain: 'Buscar de nuevo',

    noData: 'No hay suficientes datos históricos para calcular la probabilidad de retraso.',
    tryAnother: 'Probar otro vuelo',
    cached: 'En caché',
    refresh: 'Actualizar',

    delayChance: 'probabilidad de retraso',
    lookingGood: 'Buen aspecto',
    moderateRisk: 'Riesgo moderado',
    highRisk: 'Alto riesgo',

    onTime: 'A tiempo',
    minorDelay: 'Retraso menor',
    moderate: 'Moderado',
    severe: 'Grave',
    cancelled: 'Cancelado',
    basedOn: 'Basado en',
    flights: 'vuelos',
    last90: 'últimos 90 días',

    live: 'En vivo',
    noLiveData: 'Sin datos en vivo',
    onGround: 'En tierra',
    airborne: 'En vuelo',

    recent: 'Recientes',
    clearAll: 'Borrar todo',

    dataSource: 'Datos: AeroDataBox · OpenSky Network',
    liveRefresh: 'Posición en vivo cada 30s',
    donate: 'Invítame un café',
  },
}

export const LOCALES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pl', label: 'PL', name: 'Polski' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'es', label: 'ES', name: 'Español' },
]
