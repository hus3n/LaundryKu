'use client';

export default function LogoPreviewPage() {
  const options = [
    {
      id: 'A',
      name: 'Opsi A — Mesin Cuci Modern',
      description: 'Ikon mesin cuci stylized dengan gradasi biru. Cocok untuk kesan teknologi & kepercayaan.',
      logoSrc: '/logo/logo-option-a.svg',
      iconSrc: '/logo/icon-option-a.svg',
      palette: ['#2563eb', '#0ea5e9'],
    },
    {
      id: 'B',
      name: 'Opsi B — Gelombang Air Segar',
      description: 'Ikon lingkaran dengan gelombang air. Cocok untuk kesan segar, bersih, dan alami.',
      logoSrc: '/logo/logo-option-b.svg',
      iconSrc: '/logo/icon-option-b.svg',
      palette: ['#0f766e', '#06b6d4'],
    },
    {
      id: 'C',
      name: 'Opsi C — Tetesan Minimalis',
      description: 'Simbol tetesan air dengan ikon baju di dalamnya. Cocok untuk kesan premium dan elegan.',
      logoSrc: '/logo/logo-option-c.svg',
      iconSrc: '/logo/icon-option-c.svg',
      palette: ['#6366f1', '#4f46e5'],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
          Pilihan Logo LaundryKu
        </h1>
        <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '15px' }}>
          Berikut adalah 3 opsi logo yang tersedia. Pilih logo yang paling mencerminkan identitas aplikasi Anda.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {options.map((opt) => (
            <div
              key={opt.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
                {/* Ikon Besar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <img src={opt.iconSrc} alt={`Icon ${opt.id}`} style={{ width: '80px', height: '80px' }} />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>App Icon</span>
                </div>

                {/* Logo Landscape */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <img src={opt.logoSrc} alt={`Logo ${opt.id}`} style={{ height: '50px' }} />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Logo Penuh</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a', marginBottom: '4px' }}>
                    {opt.name}
                  </div>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
                    {opt.description}
                  </p>
                  {/* Palet Warna */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Warna:</span>
                    {opt.palette.map((color) => (
                      <div
                        key={color}
                        title={color}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: color,
                          border: '2px solid #f1f5f9',
                        }}
                      />
                    ))}
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{opt.palette.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Preview di Background Gelap */}
              <div style={{
                marginTop: '24px',
                background: '#0f172a',
                borderRadius: '10px',
                padding: '20px 24px',
                display: 'flex',
                gap: '32px',
                alignItems: 'center',
              }}>
                <span style={{ color: '#475569', fontSize: '12px' }}>Dark bg:</span>
                <img src={opt.iconSrc} alt="" style={{ width: '40px', height: '40px' }} />
                <img src={opt.logoSrc} alt="" style={{ height: '36px' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: '#eff6ff',
          borderRadius: '12px',
          border: '1px solid #bfdbfe',
        }}>
          <p style={{ color: '#1e40af', fontSize: '14px', fontWeight: '600' }}>
            📌 Cara Memilih Logo
          </p>
          <p style={{ color: '#3b82f6', fontSize: '13px', marginTop: '8px' }}>
            Setelah memilih opsi, hubungi developer untuk mengintegrasikan logo ke seluruh aplikasi
            (favicon, header, loading screen, nota cetak).
            File SVG tersedia di: <code>frontend/public/logo/</code>
          </p>
        </div>
      </div>
    </div>
  );
}
