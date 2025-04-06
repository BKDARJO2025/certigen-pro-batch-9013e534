
import { useEffect } from 'react';

const FontInitializer = () => {
  useEffect(() => {
    // Inisialisasi font yang sudah diunggah pengguna
    const uploadedFonts = localStorage.getItem("lovable.dev.uploadedFonts");
    if (uploadedFonts) {
      try {
        const fonts = JSON.parse(uploadedFonts);
        fonts.forEach((font: { name: string, family: string }) => {
          // Cek apakah font data tersedia di localStorage
          const fontData = localStorage.getItem(`lovable.dev.font.${font.family}`);
          if (fontData) {
            // Cek apakah font sudah diinisialisasi
            const existingStyle = document.getElementById(`font-style-${font.family}`);
            if (!existingStyle) {
              // Buat style element untuk font
              const style = document.createElement('style');
              style.id = `font-style-${font.family}`;
              style.textContent = `
                @font-face {
                  font-family: '${font.family}';
                  src: url('${fontData}') format('truetype');
                  font-weight: normal;
                  font-style: normal;
                }
              `;
              document.head.appendChild(style);
            }
          }
        });
      } catch (error) {
        console.error("Error initializing fonts:", error);
      }
    }
  }, []);

  return null; // Komponen ini tidak merender apapun
};

export default FontInitializer;
