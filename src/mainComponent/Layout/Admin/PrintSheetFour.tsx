// PrintSheetFour.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLazyDownloadPrintSheetQuery } from "@/redux-store/services/AdminCentrix/printApi";
import toast from "react-hot-toast";

export default function PrintSheetFour() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenId = searchParams.get("tokenId");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [trigger, { isFetching }] = useLazyDownloadPrintSheetQuery();

  useEffect(() => {
    if (!tokenId) return;

    trigger(tokenId)
      .unwrap()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      })
      .catch((err) => {
        toast.error(err?.data?.message ?? "Failed to generate print sheet");
      });

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [tokenId]);

  const handleDownload = () => {
    if (!pdfUrl || !tokenId) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `scanfleet-${tokenId}.pdf`;
    a.click();
  };

  return (
    <div className='min-h-screen bg-black text-white flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            onClick={() => navigate(-1)}
            className='text-white/70 hover:text-white hover:bg-white/10 gap-2'
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <div>
            <h1 className='text-lg font-bold text-white'>Print Sheet</h1>
            {tokenId && (
              <p className='text-xs text-white/50 font-mono'>{tokenId}</p>
            )}
          </div>
        </div>
        <Button
          onClick={handleDownload}
          disabled={!pdfUrl || isFetching}
          className='bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white gap-2'
        >
          <Download size={16} />
          Download PDF
        </Button>
      </div>

      {/* Body */}
      <div className='flex-1 flex items-center justify-center p-6'>
        {!tokenId ? (
          <p className='text-white/40'>No tokenId provided in URL.</p>
        ) : isFetching ? (
          <div className='flex flex-col items-center gap-3 text-white/60'>
            <Loader2 size={32} className='animate-spin text-cyan-400' />
            <p className='text-sm'>Generating print sheet…</p>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className='w-full max-w-3xl rounded-xl border border-white/10 shadow-2xl'
            style={{ height: "85vh" }}
            title='Print Sheet Preview'
          />
        ) : (
          <p className='text-white/40 text-sm'>Failed to load PDF.</p>
        )}
      </div>
    </div>
  );
}
