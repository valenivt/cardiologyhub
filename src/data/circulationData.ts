import { HeartPart, MechanismStep, QuizQuestion, VesselComparison } from '../types/cardiology';

export const HEART_PARTS: HeartPart[] = [
  {
    id: 'atrium_dexter',
    nameId: 'Atrium Kanan (Serambi Kanan)',
    nameLatin: 'Atrium Dextrum',
    category: 'chambers',
    gasType: 'co2',
    description: 'Ruang penerima darah miskin O₂ (kaya CO₂) dari seluruh jaringan tubuh melalui Vena Kava Superior dan Vena Kava Inferior.',
    functionDetail: 'Menampung darah balik sistemik bertekanan rendah dan meneruskannya ke Ventrikel Kanan melalui Katup Trikuspidalis saat fase diastole ventrikel.',
    wallThickness: 'Dinding tipis (2-3 mm) karena hanya bertugas memompa darah berjarak pendek ke ventrikel di bawahnya.',
    erlanggaNote: 'Hlm. 167: Menerima darah kaya CO₂ dari systemic veins (vena kava) sebelum ventrikel relaksasi dan katup trikuspid terbuka.'
  },
  {
    id: 'ventrikel_dexter',
    nameId: 'Ventrikel Kanan (Bilik Kanan)',
    nameLatin: 'Ventriculus Dexter',
    category: 'chambers',
    gasType: 'co2',
    description: 'Ruang pemompa darah kaya CO₂ menuju paru-paru (pulmo) melalui arteri pulmonalis dalam sistem peredaran darah kecil.',
    functionDetail: 'Saat berkontraksi (sistole), katup trikuspidalis menutup dan katup semilunaris pulmonalis terbuka, mengalirkan darah ke arteri pulmonalis kanan dan kiri.',
    wallThickness: 'Dinding berotot sedang (4-5 mm), cukup kuat untuk memompa darah menuju sirkuit pulmonalis berhambatan rendah.',
    erlanggaNote: 'Hlm. 167: Mengawali peredaran darah pulmonalis dengan berkontraksi memompa darah kaya CO₂.'
  },
  {
    id: 'atrium_sinister',
    nameId: 'Atrium Kiri (Serambi Kiri)',
    nameLatin: 'Atrium Sinistrum',
    category: 'chambers',
    gasType: 'o2',
    description: 'Ruang penerima darah bersih yang kaya O₂ langsung dari pulmo (paru-paru) melalui 4 muara Vena Pulmonalis.',
    functionDetail: 'Menampung darah yang baru saja mengalami oksigenasi di alveolus, lalu mengalirkannya ke Ventrikel Kiri melalui Katup Bikuspidalis (Mitral).',
    wallThickness: 'Dinding tipis (2-3 mm), bekerja pasif dan aktif mendorong darah ke ventrikel kiri.',
    erlanggaNote: 'Hlm. 167: Menerima darah kaya O₂ yang dibawa oleh Pulmonary Vein dari paru-paru.'
  },
  {
    id: 'ventrikel_sinister',
    nameId: 'Ventrikel Kiri (Bilik Kiri)',
    nameLatin: 'Ventriculus Sinister',
    category: 'chambers',
    gasType: 'o2',
    description: 'Ruang jantung terbesar dan paling berotot, memompa darah kaya O₂ ke seluruh organ dan jaringan tubuh melalui Aorta.',
    functionDetail: 'Menciptakan tekanan sistolik utama (±120 mmHg) saat berkontraksi. Katup bikuspidalis menutup dan katup semilunaris aorta membuka lebar.',
    wallThickness: 'Dinding miokardium sangat tebal (10-15 mm, 3x lebih tebal dari ventrikel kanan) guna mengatasi resistensi perifer vaskular seluruh tubuh.',
    erlanggaNote: 'Hlm. 167-168: Ventrikel kiri berkontraksi memompa darah kaya O₂ ke aorta dan arteri sistemik dengan daya dorong sistole ±120 mmHg.'
  },
  {
    id: 'valvula_trikuspidalis',
    nameId: 'Katup Trikuspidalis (Katup Berdaun Tiga)',
    nameLatin: 'Valvula Tricuspidalis',
    category: 'valves',
    gasType: 'co2',
    description: 'Katup atrioventrikular kanan yang terdiri atas 3 daun katup (cuspis) fleksibel terhubung dengan korda tendinea.',
    functionDetail: 'Mencegah aliran balik darah dari ventrikel kanan kembali ke atrium kanan saat ventrikel berkontraksi (sistole).',
    wallThickness: 'Struktur membran fibroelastik kuat tertambat pada otot papilaris.',
    erlanggaNote: 'Hlm. 167: Saat ventrikel kanan berkontraksi, katup trikuspid tertutup rapat mencegah regurgitasi darah ke atrium.'
  },
  {
    id: 'valvula_bikuspidalis',
    nameId: 'Katup Bikuspidalis / Mitral (Katup Berdaun Dua)',
    nameLatin: 'Valvula Bicuspidalis (Mitralis)',
    category: 'valves',
    gasType: 'o2',
    description: 'Katup atrioventrikular kiri yang memiliki 2 daun katup kokoh menyerupai mahkota uskup (mitra).',
    functionDetail: 'Menahan tekanan dorong tinggi ventrikel kiri agar darah beroksigen tidak kembali menyembur ke atrium kiri atau vena pulmonalis.',
    wallThickness: 'Membran fibrosa sangat kuat dengan insersi korda tendinea kokoh.',
    erlanggaNote: 'Hlm. 167: Ventrikel kiri berkontraksi menyebabkan katup bikuspid tertutup rapat.'
  },
  {
    id: 'valvula_semilunaris_pulmonalis',
    nameId: 'Katup Semilunaris Paru-Paru (Pulmonal)',
    nameLatin: 'Valvula Semilunaris Arteriae Pulmonalis',
    category: 'valves',
    gasType: 'co2',
    description: 'Katup berbentuk bulan sabit (semilunar) berdaun tiga di pangkal trunkus pulmonalis.',
    functionDetail: 'Terbuka saat sistole ventrikel kanan dan menutup saat diastole untuk mencegah darah di arteri paru-paru kembali masuk ke ventrikel.',
    wallThickness: 'Daun katup berbentuk kantung bulan sabit tipis nan kenyal.',
    erlanggaNote: 'Hlm. 167: Katup semilunar arteri paru-paru terbuka menyalurkan darah kaya CO₂.'
  },
  {
    id: 'valvula_semilunaris_aorta',
    nameId: 'Katup Semilunaris Aorta',
    nameLatin: 'Valvula Semilunaris Aortae',
    category: 'valves',
    gasType: 'o2',
    description: 'Katup semilunar kuat di pangkal muara aorta utama.',
    functionDetail: 'Membuka saat ejeksi sistolik ventrikel kiri (±120 mmHg) dan menutup rapat saat diastole, memicu bunyi jantung kedua (Dub / S2).',
    wallThickness: 'Membran tebal elastis tahan tekanan tinggi aorta.',
    erlanggaNote: 'Hlm. 167: Katup semilunar aorta terbuka saat ventrikel kiri berkontraksi.'
  },
  {
    id: 'arteri_pulmonalis',
    nameId: 'Arteri Pulmonalis (Pulmonary Artery)',
    nameLatin: 'Arteria Pulmonalis',
    category: 'vessels',
    gasType: 'co2',
    description: 'Satu-satunya arteri dalam tubuh manusia yang membawa darah miskin O₂ (kaya CO₂) keluar dari jantung.',
    functionDetail: 'Bercabang dua menjadi arteri pulmonalis dekstra (ke pulmo kanan) dan arteri pulmonalis sinistra (ke pulmo kiri).',
    wallThickness: 'Dinding elastis bertekanan sedang (tekanan arteri paru rata-rata ~15-25 mmHg).',
    erlanggaNote: 'Hlm. 167: Membawa darah kaya CO₂ dari ventrikel kanan menuju paru-paru kanan & kiri.'
  },
  {
    id: 'vena_pulmonalis',
    nameId: 'Vena Pulmonalis (Pulmonary Vein)',
    nameLatin: 'Vena Pulmonalis',
    category: 'vessels',
    gasType: 'o2',
    description: 'Satu-satunya vena dalam tubuh manusia yang membawa darah kaya O₂ murni menuju ke jantung.',
    functionDetail: 'Terdiri dari 4 saluran vena (2 dari pulmo kanan, 2 dari pulmo kiri) bermuara langsung ke atrium kiri jantung.',
    wallThickness: 'Dinding vena berotot tipis tanpa katup di sepanjang salurannya.',
    erlanggaNote: 'Hlm. 167: Membawa darah kaya O₂ dari paru-paru langsung menuju atrium kiri jantung.'
  },
  {
    id: 'aorta',
    nameId: 'Aorta & Arteri Sistemik (Systemic Arteries)',
    nameLatin: 'Aorta Ascendens & Arcus Aortae',
    category: 'vessels',
    gasType: 'o2',
    description: 'Pembuluh nadi terbesar bertindak sebagai pipa induk pendistribusi darah kaya O₂ ke kepala, lengan, organ dalam, dan tungkai.',
    functionDetail: 'Menerima dorongan darah bertekanan tinggi (sistole) dengan elastisitas tinggi (efek Windkessel) untuk menjaga aliran darah kontinu.',
    wallThickness: 'Dinding tebal berotot polos tebal dengan lapisan serat elastin melimpah.',
    erlanggaNote: 'Hlm. 167-168: Darah diedarkan ke seluruh tubuh melalui aorta dan arteri sistemik dengan tekanan ±120 mmHg.'
  },
  {
    id: 'vena_cava',
    nameId: 'Vena Kava & Vena Sistemik (Systemic Veins)',
    nameLatin: 'Vena Cava Superior & Inferior',
    category: 'vessels',
    gasType: 'co2',
    description: 'Pembuluh balik terbesar pembawa darah sisa metabolisme (kaya CO₂) dari separuh tubuh atas dan bawah.',
    functionDetail: 'Vena kava superior mengalirkan darah dari kepala dan lengan, vena kava inferior mengalirkan darah dari torso dan kaki ke atrium kanan.',
    wallThickness: 'Lumen lebar berdinding tipis dengan katup-katup satu arah (pada vena perifer).',
    erlanggaNote: 'Hlm. 167: Mengalirkan kembali darah kaya CO₂ dari jaringan tubuh menuju atrium kanan jantung.'
  },
  {
    id: 'septum_cordis',
    nameId: 'Septum Kordis (Sekat Jantung)',
    nameLatin: 'Septum Interventriculare & Interatriale',
    category: 'muscle',
    gasType: 'neutral',
    description: 'Dinding otot kokoh pemisah sempurna antara jantung sisi kanan (darah ber-CO₂) dan sisi kiri (darah ber-O₂).',
    functionDetail: 'Mencegah bercampurnya darah terdeoksigenasi di ventrikel/atrium kanan dengan darah teroksigenasi di ventrikel/atrium kiri pada mamalia.',
    wallThickness: 'Dinding otot miokardium padat dan tebal.',
    erlanggaNote: 'Hlm. 167: Jantung manusia memiliki sekat sempurna 4 ruang sehingga sirkulasi darah ganda terpisah secara efisien.'
  }
];

export const PULMONARY_STEPS: MechanismStep[] = [
  {
    stepNumber: 1,
    title: 'Kontraksi Ventrikel Kanan',
    action: 'Ventrikel kanan berkontraksi untuk memompa darah kaya CO₂.',
    valveState: 'Memicu pergerakan daun katup atrioventrikular.',
    gasState: 'co2',
    erlanggaQuote: 'Ventrikel kanan berkontraksi...',
    highlightPart: 'Ventrikel Kanan',
    icon: 'fa-heart-pulse'
  },
  {
    stepNumber: 2,
    title: 'Penutupan Katup Trikuspidalis',
    action: 'Katup menutup agar darah tidak kembali ke atrium kanan.',
    valveState: 'Katup Trikuspid TERTUTUP (Mencegah regurgitasi darah ke atrium kanan)',
    gasState: 'co2',
    erlanggaQuote: '...katup trikuspid tertutup...',
    highlightPart: 'Katup Trikuspid',
    icon: 'fa-shield-halved'
  },
  {
    stepNumber: 3,
    title: 'Pembukaan Katup Pulmonalis',
    action: 'Katup terbuka saat tekanan ventrikel kanan melebihi tekanan arteri pulmonalis.',
    valveState: 'Katup Pulmonalis TERBUKA',
    gasState: 'co2',
    erlanggaQuote: '...katup semilunar arteri paru-paru terbuka...',
    highlightPart: 'Katup Pulmonalis',
    icon: 'fa-door-open'
  },
  {
    stepNumber: 4,
    title: 'Ejeksi ke Arteri Pulmonalis',
    action: 'Darah kaya CO₂ mengalir menuju paru-paru.',
    valveState: 'Aliran deras searah menuju cabang arteri paru-paru kanan & kiri',
    gasState: 'co2',
    erlanggaQuote: '...darah kaya CO₂ dari ventrikel kanan dibawa oleh Pulmonary Artery menuju paru-paru kanan & kiri...',
    highlightPart: 'Arteri Pulmonalis',
    icon: 'fa-paper-plane'
  },
  {
    stepNumber: 5,
    title: 'Pertukaran Gas di Alveolus',
    action: 'Darah melepaskan CO₂ dan menyerap O₂.',
    valveState: 'Difusi gas: darah melepaskan CO₂ dan menyerap O₂ di alveolus',
    gasState: 'o2',
    erlanggaQuote: '...di paru-paru darah melepaskan CO₂ dan mengambil O₂...',
    highlightPart: 'Alveolus Paru-Paru',
    icon: 'fa-lungs'
  },
  {
    stepNumber: 6,
    title: 'Kembali ke Atrium Kiri',
    action: 'Darah kaya O₂ kembali melalui vena pulmonalis ke atrium kiri, lalu menuju ventrikel kiri melalui katup bikuspidalis.',
    valveState: 'Katup Bikuspid TERBUKA, darah mengalir ke ventrikel kiri',
    gasState: 'o2',
    erlanggaQuote: '...darah kaya O₂ dibawa oleh Pulmonary Vein menuju atrium kiri ➔ katup bikuspid terbuka ➔ darah mengalir ke ventrikel kiri.',
    highlightPart: 'Vena Pulmonalis & Atrium Kiri',
    icon: 'fa-circle-arrow-down'
  }
];

export const SYSTEMIC_STEPS: MechanismStep[] = [
  {
    stepNumber: 1,
    title: 'Kontraksi Ventrikel Kiri',
    action: 'Ventrikel kiri (bilik kiri) berdinding otot tebal berkontraksi sangat kuat, memicu gaya dorong sistole berkekuatan ±120 mmHg.',
    valveState: 'Tekanan puncak sistolik dalam rongga ventrikel kiri tercapai',
    gasState: 'o2',
    erlanggaQuote: 'Ventrikel kiri berkontraksi...',
    highlightPart: 'Ventrikel Kiri',
    icon: 'fa-heart-pulse'
  },
  {
    stepNumber: 2,
    title: 'Penutupan Katup Bikuspidalis (Mitral)',
    action: 'Katup bikuspidalis menutup rapat seketika, mencegah darah bertekanan tinggi kembali menyembur ke atrium kiri.',
    valveState: 'Katup Bikuspid / Mitral TERTUTUP RAPAT',
    gasState: 'o2',
    erlanggaQuote: '...katup bikuspid tertutup...',
    highlightPart: 'Katup Bikuspid',
    icon: 'fa-lock'
  },
  {
    stepNumber: 3,
    title: 'Pembukaan Katup Semilunar Aorta',
    action: 'Pintu gerbang katup semilunaris aorta terbuka saat tekanan ventrikel mengalahkan tekanan hidrostatik aorta.',
    valveState: 'Katup Semilunaris Aorta TERBUKA LEBAR',
    gasState: 'o2',
    erlanggaQuote: '...katup semilunar aorta terbuka...',
    highlightPart: 'Katup Semilunar Aorta',
    icon: 'fa-door-open'
  },
  {
    stepNumber: 4,
    title: 'Distribusi Darah via Aorta & Arteri Sistemik',
    action: 'Darah kaya O₂ disemburkan ke aorta dan didistribusikan melalui seluruh percabangan arteri sistemik (arteriola & kapiler sistemik) ke seluruh tubuh.',
    valveState: 'Aliran sistemik bertekanan tinggi menyebar ke otak, visera, dan ekstremitas',
    gasState: 'o2',
    erlanggaQuote: '...darah kaya O₂ dari ventrikel kiri diedarkan ke seluruh tubuh via aorta dan Systemic Arteries...',
    highlightPart: 'Aorta & Arteri Sistemik',
    icon: 'fa-route'
  },
  {
    stepNumber: 5,
    title: 'Pertukaran Gas & Nutrisi di Jaringan Tubuh',
    action: 'Di kapiler seluler seluruh tubuh, eritrosit melepaskan O₂ ke mitokondria sel untuk respirasi seluler dan mengangkut CO₂ sisa metabolisme ke dalam plasma darah.',
    valveState: 'Darah berubah status dari teroksigenasi menjadi terdeoksigenasi (miskin O₂, kaya CO₂)',
    gasState: 'co2',
    erlanggaQuote: '...di jaringan tubuh darah melepaskan O₂ dan mengambil CO₂...',
    highlightPart: 'Kapiler Jaringan Tubuh',
    icon: 'fa-arrows-split-up-and-left'
  },
  {
    stepNumber: 6,
    title: 'Aliran Balik via Vena Sistemik ke Atrium Kanan',
    action: 'Darah kaya CO₂ dikumpulkan oleh venula dan vena sistemik (Vena Kava Superior & Inferior) kembali ke atrium kanan. Ventrikel relaksasi, katup trikuspid terbuka, darah mengisi ventrikel kanan.',
    valveState: 'Katup Trikuspid TERBUKA, Ventrikel kanan relaksasi siap mengulang siklus',
    gasState: 'co2',
    erlanggaQuote: '...darah kaya CO₂ dibawa oleh Systemic Veins (vena kava) menuju atrium kanan ➔ ventrikel relaksasi ➔ katup trikuspid terbuka ➔ darah mengalir ke ventrikel kanan.',
    highlightPart: 'Vena Kava & Atrium Kanan',
    icon: 'fa-rotate-left'
  }
];

export const BLOOD_PRESSURE_INFO = {
  systole: {
    title: 'Tekanan Sistole (Kontraksi Ventrikel)',
    valueRange: '±120 mmHg',
    definition: 'Daya dorong darah terhadap dinding arteri saat ventrikel berkontraksi memompa darah ke aorta dan sirkulasi sistemik.',
    mechanism: 'Saat ventrikel kiri berkontraksi memeras darah masuk ke aorta, dinding aorta yang elastis meregang menerima volume sekuncup (stroke volume).',
    clinicalNote: 'Pada tensimeter, sistole terdengar sebagai ketukan bunyi pertama (Bunyi Korotkoff I) saat tekanan manset mulai diturunkan melampaui tekanan intra-arteri.',
    erlanggaPage: 'Buku Erlangga Halaman 168-169'
  },
  diastole: {
    title: 'Tekanan Diastole (Relaksasi Ventrikel)',
    valueRange: '±80 mmHg',
    definition: 'Titik tekanan darah terendah di arteri saat ventrikel jantung berada dalam fase relaksasi dan pengisian darah kembali dari atrium.',
    mechanism: 'Katup semilunar menutup, otot ventrikel mengendur. Tekanan dipertahankan oleh recoil elastis dinding arteri perifer agar perfusi darah tetap berlangsung.',
    clinicalNote: 'Pada tensimeter, diastole ditandai saat bunyi ketukan Korotkoff menghilang sempurna (Fase Korotkoff V). Nilai standar normal remaja/dewasa: 120/80 mmHg.',
    erlanggaPage: 'Buku Erlangga Halaman 168-169'
  },
  measurement: {
    site: 'Arteri Brakialis (Lengan Atas)',
    apparatus: 'Sphygmomanometer (Tensimeter Air Raksa / Aneroid / Digital) & Stetoskop',
    procedure: 'Manset dipasang melingkari lengan atas setinggi jantung. Udara dipompa hingga menekan arteri brakialis sampai aliran terhenti, kemudian katup udara dibuka perlahan untuk membaca sistole dan diastole.'
  }
};

export const VESSEL_COMPARISON_TABLE: VesselComparison[] = [
  {
    feature: 'Arah Aliran Darah',
    artery: 'Meninggalkan jantung (menuju organ/jaringan)',
    vein: 'Menuju jantung (kembali dari jaringan)',
    capillary: 'Menghubungkan ujung arteriola dengan venula'
  },
  {
    feature: 'Kandungan Gas Darah',
    artery: 'Kaya O₂ (Kecuali Arteri Pulmonalis yang kaya CO₂)',
    vein: 'Kaya CO₂ (Kecuali Vena Pulmonalis yang kaya O₂)',
    capillary: 'Terjadi pertukaran O₂, CO₂, glukosa, dan zat sisa'
  },
  {
    feature: 'Dinding Pembuluh',
    artery: 'Tebal, elastis, berotot kuat menahan tekanan tinggi',
    vein: 'Tipis, kurang elastis, lumen lebih lebar',
    capillary: 'Sangat tipis, selapis sel endotelium permeabel'
  },
  {
    feature: 'Tekanan Darah',
    artery: 'Tinggi dan berdenyut kuat (jika terpotong darah memancar)',
    vein: 'Rendah dan lemah (jika terpotong darah menetes/mengalir)',
    capillary: 'Sangat rendah (memfasilitasi difusi molekul)'
  },
  {
    feature: 'Keberadaan Katup',
    artery: 'Hanya ada 1 di pangkal keluar jantung (Katup Semilunar)',
    vein: 'Banyak katup berbentuk bulan sabit di sepanjang pembuluh',
    capillary: 'Tidak memiliki katup'
  },
  {
    feature: 'Letak dalam Tubuh',
    artery: 'Umumnya tersembunyi jauh di dalam jaringan otot tubuh',
    vein: 'Dekat dengan permukaan kulit (tampak kebiruan)',
    capillary: 'Mikroskopis tersebar di seluruh jaringan sel'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Berdasarkan buku Erlangga hlm. 167, manakah urutan yang benar pada peredaran darah pulmonalis (kecil)?',
    options: [
      'Ventrikel kanan ➔ Arteri pulmonalis ➔ Paru-paru ➔ Vena pulmonalis ➔ Atrium kiri',
      'Ventrikel kiri ➔ Aorta ➔ Paru-paru ➔ Vena cava ➔ Atrium kanan',
      'Atrium kanan ➔ Vena pulmonalis ➔ Paru-paru ➔ Arteri pulmonalis ➔ Ventrikel kiri',
      'Ventrikel kanan ➔ Vena cava ➔ Paru-paru ➔ Aorta ➔ Atrium kiri'
    ],
    correctIndex: 0,
    explanation: 'Peredaran darah pulmonalis dimulai dari kontraksi ventrikel kanan yang memompa darah kaya CO₂ via arteri pulmonalis menuju paru-paru, melepaskan CO₂ dan mengikat O₂, lalu dialirkan via vena pulmonalis ke atrium kiri.',
    referencePage: 'Erlangga Hlm. 167'
  },
  {
    id: 2,
    question: 'Saat ventrikel kiri berkontraksi pada peredaran darah sistemik, peristiwa mekanis katup apa yang terjadi?',
    options: [
      'Katup bikuspid terbuka dan katup aorta tertutup',
      'Katup bikuspid tertutup rapat dan katup semilunar aorta terbuka',
      'Katup trikuspid terbuka dan katup pulmonalis tertutup',
      'Semua katup jantung menutup secara bersamaan'
    ],
    correctIndex: 1,
    explanation: 'Pada sistole ventrikel kiri, katup bikuspid (mitral) tertutup rapat untuk mencegah aliran balik darah ke atrium kiri, sementara katup semilunar aorta terbuka lebar agar darah dipompa ke aorta.',
    referencePage: 'Erlangga Hlm. 167'
  },
  {
    id: 3,
    question: 'Mengapa dinding otot miokardium ventrikel kiri kira-kira 3 kali lebih tebal dibandingkan ventrikel kanan?',
    options: [
      'Karena ventrikel kiri menampung volume darah 3 kali lebih banyak',
      'Karena ventrikel kiri harus mengatasi resistensi sirkulasi sistemik ke seluruh tubuh yang berjarak jauh',
      'Karena darah di ventrikel kiri mengandung banyak karbondioksida beracun',
      'Karena ventrikel kiri tidak memiliki katup semilunar'
    ],
    correctIndex: 1,
    explanation: 'Ventrikel kiri bertugas memompa darah ke seluruh tubuh (sirkuit sistemik) yang memerlukan daya dorong sistolik tinggi (±120 mmHg), sedangkan ventrikel kanan hanya memompa ke paru-paru yang letaknya berdekatan.',
    referencePage: 'Erlangga Hlm. 167-168'
  },
  {
    id: 4,
    question: 'Pernyataan yang tepat mengenai nilai tekanan darah normal 120/80 mmHg menurut fisiologi Erlangga adalah...',
    options: [
      '120 adalah tekanan diastole saat ventrikel relaksasi, 80 adalah tekanan sistole saat ventrikel memompa',
      '120 adalah tekanan sistole saat ventrikel berkontraksi memompa ke aorta, 80 adalah tekanan diastole saat ventrikel berelaksasi',
      'Keduanya diukur langsung di dalam serambi kanan dengan stetoskop',
      '120 mmHg adalah tekanan dalam kapiler dan 80 mmHg adalah tekanan dalam vena pulmonalis'
    ],
    correctIndex: 1,
    explanation: 'Angka 120 mmHg merupakan tekanan sistole (puncak saat ventrikel berkontraksi memompa darah), sedangkan 80 mmHg adalah tekanan diastole (titik terendah saat ventrikel berelaksasi dan terisi darah kembali).',
    referencePage: 'Erlangga Hlm. 168-169'
  },
  {
    id: 5,
    question: 'Di manakah lokasi standar dan pembuluh darah yang digunakan untuk pengukuran tekanan darah menggunakan tensimeter dan stetoskop?',
    options: [
      'Vena jugularis pada bagian leher',
      'Arteri karotis pada pelipis kepala',
      'Arteri brakialis pada lengan atas',
      'Arteri radialis pada telapak kaki'
    ],
    correctIndex: 2,
    explanation: 'Pengukuran tekanan darah standar dilakukan pada Arteri Brakialis di lengan atas karena posisinya sejajar secara horizontal dengan posisi jantung anatomis.',
    referencePage: 'Erlangga Hlm. 169'
  }
];

export const GLOSSARY_ITEMS = [
  { term: 'Sirkulasi Pulmonalis', definition: 'Peredaran darah kecil yang mengalirkan darah dari ventrikel kanan jantung ke paru-paru dan kembali ke atrium kiri jantung.' },
  { term: 'Sirkulasi Sistemik', definition: 'Peredaran darah besar yang mendistribusikan darah kaya O₂ dari ventrikel kiri jantung ke seluruh sel-sel tubuh dan kembali ke atrium kanan.' },
  { term: 'Tekanan Sistole', definition: 'Tekanan hidrostatik darah tertinggi pada dinding arteri yang terjadi saat ventrikel jantung berkontraksi aktif (normal ±120 mmHg).' },
  { term: 'Tekanan Diastole', definition: 'Tekanan darah terendah di dinding arteri yang terjadi saat ventrikel jantung berada dalam fase relaksasi (normal ±80 mmHg).' },
  { term: 'Katup Trikuspidalis', definition: 'Katup dengan tiga katup penutup di antara atrium kanan dan ventrikel kanan; mencegah darah mengalir balik ke serambi kanan.' },
  { term: 'Katup Bikuspidalis (Mitral)', definition: 'Katup berdaun dua antara atrium kiri dan ventrikel kiri; mencegah darah bertekanan tinggi kembali ke serambi kiri.' },
  { term: 'Katup Semilunaris', definition: 'Katup berbentuk bulan sabit di muara pangkal aorta dan arteri pulmonalis; mencegah aliran balik darah ke bilik saat diastole.' },
  { term: 'Arteri Pulmonalis', definition: 'Pembuluh nadi yang membawa darah kaya CO₂ dari bilik kanan ke jaringan paru-paru untuk oksigenasi.' },
  { term: 'Vena Pulmonalis', definition: 'Empat saluran pembuluh balik pembawa darah kaya O₂ dari paru-paru menuju serambi kiri jantung.' },
  { term: 'Aorta', definition: 'Arteri terbesar dalam tubuh manusia yang keluar dari ventrikel kiri mendistribusikan darah bersih ke seluruh sistemik.' },
  { term: 'Vena Kava', definition: 'Vena utama tubuh (superior membawa darah dari tubuh atas, inferior dari tubuh bawah) yang bermuara di serambi kanan.' },
  { term: 'Arteri Brakialis', definition: 'Arteri utama pada lengan atas yang posisinya sejajar ketinggian jantung, digunakan sebagai titik standar pengukuran tekanan darah.' },
  { term: 'Bunyi Korotkoff', definition: 'Suara ketukan turbulensi aliran darah arteri yang didengar melalui stetoskop saat menurunkan tekanan manset tensimeter.' }
];
