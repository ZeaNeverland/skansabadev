const UnitProduksiPage = () => {
  return (
    <div className="pt-24 container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Unit Produksi</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Website Unit Produksi SMK Negeri 1 Bantul
          </p>
          <a 
            href="https://up.skansaba.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Buka di tab baru
          </a>
        </div>
        
        <div className="relative w-full" style={{ height: 'calc(100vh - 200px)' }}>
          <iframe
            src="https://up.skansaba.dev/"
            className="w-full h-full border-0"
            title="Website Unit Produksi SMK Negeri 1 Bantul"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
          
          {/* Fallback jika iframe tidak bisa dimuat */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 hidden" id="iframe-fallback">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <h3 className="text-xl font-bold mb-4">Tidak dapat memuat website</h3>
              <p className="text-gray-600 mb-6">
                Website Unit Produksi tidak dapat ditampilkan di sini. Silakan kunjungi langsung melalui link di bawah ini.
              </p>
              <a 
                href="https://up.skansaba.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Kunjungi Website Unit Produksi
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const iframe = document.querySelector('iframe');
              const fallback = document.getElementById('iframe-fallback');
              
              iframe.addEventListener('load', function() {
                try {
                  // Coba akses konten iframe untuk memastikan tidak ada error
                  const iframeContent = iframe.contentWindow.document;
                  // Jika berhasil, sembunyikan fallback
                  fallback.classList.add('hidden');
                } catch (e) {
                  // Jika gagal (karena cross-origin), tampilkan fallback
                  fallback.classList.remove('hidden');
                }
              });
              
              iframe.addEventListener('error', function() {
                // Jika gagal memuat, tampilkan fallback
                fallback.classList.remove('hidden');
              });
              
              // Timeout untuk memastikan fallback muncul jika iframe tidak memuat dengan benar
              setTimeout(function() {
                if (iframe.contentWindow.document.readyState !== 'complete') {
                  fallback.classList.remove('hidden');
                }
              }, 5000);
            });
          `,
        }}
      />
    </div>
  );
};

export default UnitProduksiPage;