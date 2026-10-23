export const languages = {
  id: 'Bahasa Indonesia',
  en: 'English',
} as const;

export type SupportedLanguage = keyof typeof languages;
export const defaultLang: SupportedLanguage = 'id';

export const ui = {
  id: {
    'brand.tagline': 'Jurnal Interpretasi Musik',
    'nav.home': 'Beranda',
    'nav.explore': 'Eksplorasi',
    'a11y.skipToContent': 'Lompat ke konten utama',
    'lang.switch': 'Ganti bahasa',
    
    'hero.eyebrow': 'Arsip Interpretasi & Narasi Musik',
    'hero.title': 'behind that song.',
    'hero.subtitle': 'aftertone adalah jurnal musik digital dwibahasa yang menggali emosi, simbolisme, narasi, dan beragam kemungkinan interpretasi di balik karya musik.',
    'hero.cta.explore': 'Jelajahi Arsip',
    'hero.cta.featured': 'Baca Pilihan Redaksi',

    'featured.badge': 'Pilihan Redaksi',
    'song.read': 'Baca Interpretasi',
    'song.readTime': 'menit baca',
    'song.by': 'oleh',
    'song.themes': 'Tema',
    'song.published': 'Diterbitkan',

    'home.recent.title': 'Interpretasi Terbaru',
    'home.recent.subtitle': 'Analisis mendalam terbaru dari meja redaksi aftertone.',
    'home.viewAll': 'Lihat Seluruh Arsip',
    'home.themes.title': 'Jelajahi Berdasarkan Tema & Suasana',
    'home.themes.subtitle': 'Temukan lagu yang saling terhubung melalui benang merah emosi dan pengalaman manusia.',

    'explore.title': 'Arsip Interpretasi',
    'explore.subtitle': 'Telusuri arsip interpretasi berdasarkan judul lagu, nama artis, atau tema emosional.',
    'explore.searchPlaceholder': 'Cari judul lagu atau nama artis...',
    'explore.filterAll': 'Semua Tema',
    'explore.showing': 'Menampilkan',
    'explore.songsCount': 'interpretasi',
    'explore.noResultsTitle': 'Tidak ada interpretasi yang cocok',
    'explore.noResultsText': 'Coba gunakan kata kunci lain atau hapus filter tema yang sedang aktif.',
    'explore.clearFilters': 'Atur Ulang Pencarian & Filter',

    'article.backToExplore': 'Kembali ke Arsip',
    'article.summaryTitle': 'Sekilas Lagu Ini',
    'article.summarySubtitle': 'The Song, in a Minute',
    'article.sourcesTitle': 'Konteks & Sumber Referensi',
    'article.sourcesSubtitle': 'Catatan editorial, pernyataan resmi, dan rujukan kontekstual.',
    'article.relatedTitle': 'Interpretasi Terkait',
    'article.relatedSubtitle': 'Karya lain yang beresonansi dengan tema atau suasana serupa.',
    'article.listenTitle': 'Dengarkan Karya Ini',
    'article.editionUnavailable': 'Edisi bahasa Inggris untuk artikel ini sedang disiapkan.',


    'footer.mission': 'aftertone memandang lagu sebagai karya naratif yang menyimpan lapis-lapis makna, emosi, dan simbolisme yang terus bergema di benak pendengar.',
    'footer.disclaimer': 'Seluruh artikel merupakan kajian editorial orisinal. Hak cipta lirik, musik, dan rekaman tetap dimiliki oleh masing-masing artis, pencipta, dan label rekaman.',
    'footer.quickLinks': 'Navigasi',
    'footer.editorialThemes': 'Tema Editorial',

    '404.title': 'Halaman Tidak Ditemukan',
    '404.text': 'Resonansi yang Anda cari tampaknya telah memudar, atau tautan ini belum terdaftar di arsip kami.',
    '404.action': 'Kembali ke Beranda',
  },
  en: {
    'brand.tagline': 'Music Interpretation Journal',
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'a11y.skipToContent': 'Skip to main content',
    'lang.switch': 'Switch language',

    'hero.eyebrow': 'Music Narrative & Symbolic Archive',
    'hero.title': 'Discover the meaning behind the music you feel.',
    'hero.subtitle': 'aftertone is a bilingual digital music journal exploring the emotions, symbolism, narratives, and multiple perspectives behind songs across genres.',
    'hero.cta.explore': 'Explore Archive',
    'hero.cta.featured': 'Read Featured Interpretation',

    'featured.badge': 'Featured Pick',
    'song.read': 'Read Interpretation',
    'song.readTime': 'min read',
    'song.by': 'by',
    'song.themes': 'Themes',
    'song.published': 'Published',

    'home.recent.title': 'Recent Interpretations',
    'home.recent.subtitle': 'Fresh in-depth analyses from the aftertone editorial desk.',
    'home.viewAll': 'View Full Archive',
    'home.themes.title': 'Explore by Theme & Emotion',
    'home.themes.subtitle': 'Discover songs connected by shared emotional threads and human stories.',

    'explore.title': 'Interpretation Archive',
    'explore.subtitle': 'Browse essays across titles, artists, and emotional themes.',
    'explore.searchPlaceholder': 'Search song title or artist...',
    'explore.filterAll': 'All Themes',
    'explore.showing': 'Showing',
    'explore.songsCount': 'interpretations',
    'explore.noResultsTitle': 'No matching interpretations found',
    'explore.noResultsText': 'Try a different search term or reset active theme filters.',
    'explore.clearFilters': 'Reset Search & Filters',

    'article.backToExplore': 'Back to Archive',
    'article.summaryTitle': 'The Song, in a Minute',
    'article.summarySubtitle': 'Core interpretation summary',
    'article.sourcesTitle': 'Sources & Context',
    'article.sourcesSubtitle': 'Editorial citations, official quotes, and contextual references.',
    'article.relatedTitle': 'Related Interpretations',
    'article.relatedSubtitle': 'Works that resonate with similar themes or atmospheric currents.',
    'article.listenTitle': 'Listen to the Song',
    'article.editionUnavailable': 'Indonesian edition for this essay is currently in preparation.',


    'footer.mission': 'aftertone treats music as an enduring narrative form, exploring the layered meanings, emotions, and symbolic afterglow left behind in the listener’s mind.',
    'footer.disclaimer': 'All essays are original editorial analyses. All song, composition, lyric, and recording rights remain the sole property of their respective creators and copyright owners.',
    'footer.quickLinks': 'Navigation',
    'footer.editorialThemes': 'Editorial Themes',

    '404.title': 'Page Not Found',
    '404.text': 'The chord you were following seems to have dissolved, or this link has not yet been cataloged in our archive.',
    '404.action': 'Return to Home',
  },
} as const;
