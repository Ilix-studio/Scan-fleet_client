import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface StickerPreviewProps {
  qrValue?: string;
  nfcEnabled?: boolean;
}

const StickerStyle = ({
  qrValue = "https://scanfleet.in",
  nfcEnabled = false,
}: StickerPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        qrValue,
        {
          width: 200,
          margin: 0,
          color: {
            dark: "#E31E52",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H",
        },
        (error: Error | null | undefined) => {
          if (error) {
            console.error("QR Code generation failed:", error);
          } else {
            setQrGenerated(true);
          }
        },
      );
    }
  }, [qrValue]);

  return (
    <div className='w-full max-w-sm mx-auto'>
      <div className='relative bg-[#E31E52] rounded-lg p-6 shadow-2xl aspect-[3/4]'>
        {/* NFC Badge */}
        {nfcEnabled && (
          <div className='absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full'>
            NFC
          </div>
        )}

        {/* Header with Logo */}
        <div className='flex items-center justify-center gap-2 mb-4'>
          <div className='w-6 h-6 bg-white rounded flex items-center justify-center'>
            <svg
              className='w-4 h-4 text-[#E31E52]'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z' />
            </svg>
          </div>
          <h1 className='text-white font-bold text-lg tracking-wider'>
            SCANFLEET
          </h1>
        </div>

        {/* Main Heading */}
        <h2 className='text-white font-bold text-2xl text-center mb-4 leading-tight'>
          IN CASE OF EMERGENCY+
        </h2>

        {/* Description */}
        <p className='text-white text-sm text-center mb-6 leading-relaxed'>
          Scan to connect with vehicle owner,
          <br />
          contact family member, get medical info,
          <br />
          vehicle related problems.
        </p>

        {/* QR Code */}
        <div className='flex justify-center mb-6'>
          <div className='bg-white p-4 rounded-lg'>
            <canvas
              ref={canvasRef}
              className={qrGenerated ? "" : "opacity-0"}
            />
          </div>
        </div>

        {/* Footer */}
        <p className='text-white text-xs text-center leading-relaxed'>
          Scan with your phone to connect instantly, visit{" "}
          <span className='font-bold'>https://scanfleet.in</span> for more.
          <br />
          Do not misuse this service.
        </p>
      </div>
    </div>
  );
};

export default StickerStyle;
