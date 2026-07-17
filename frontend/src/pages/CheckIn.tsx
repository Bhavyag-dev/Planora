import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle2, XCircle, Loader2, QrCode, User, Calendar, MapPin, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export const CheckIn = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, []);

  async function onScanSuccess(decodedText: string) {
    if (loading) return;
    
    try {
      const data = JSON.parse(decodedText);
      if (!data.registrationId) {
        setError("Invalid QR Code: No registration ID found.");
        return;
      }

      setScanResult(data);
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch('/api/registrations/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ registrationId: data.registrationId })
      });

      if (res.ok) {
        setSuccess(`Check-in successful for ${data.userName || 'Participant'}!`);
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to mark attendance.");
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError("Failed to parse QR code data.");
    } finally {
      setLoading(false);
    }
  }

  function onScanFailure(error: any) {
    // Silently ignore scan failures (they happen constantly while looking for a code)
  }

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setSuccess(null);
  };

  if (user?.role === 'student') {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <XCircle className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-zinc-400">Only administrators can access the check-in system.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Event Check-in</h1>
        <p className="text-zinc-400">Scan participant QR codes to mark attendance in real-time.</p>
      </div>

      <div className="grid gap-8">
        {/* Scanner Section */}
        <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] shadow-xl">
          <div className="bg-white/[0.05] p-4 text-center text-white">
            <div className="flex items-center justify-center gap-2">
              <QrCode size={18} className="text-emerald-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest">Live Scanner Active</span>
            </div>
          </div>
          <div id="reader" className="w-full"></div>
        </div>

        {/* Status Section */}
        <AnimatePresence mode="wait">
          {(loading || error || success || scanResult) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {loading && (
                <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/[0.05] p-6 text-zinc-400">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="font-medium">Processing check-in...</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 p-6 text-red-400 border border-red-500/20">
                  <XCircle size={24} />
                  <div>
                    <p className="font-bold">Check-in Failed</p>
                    <p className="text-sm opacity-90">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-6 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={24} />
                  <div>
                    <p className="font-bold">Success</p>
                    <p className="text-sm opacity-90">{success}</p>
                  </div>
                </div>
              )}

              {scanResult && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-white border-b border-white/[0.04] pb-2">Participant Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-white/[0.05] p-2 text-zinc-400">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Name</p>
                        <p className="font-medium">{scanResult.userName}</p>
                        <p className="text-xs text-zinc-400">{scanResult.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-white/[0.05] p-2 text-zinc-400">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Event</p>
                        <p className="font-medium">{scanResult.eventTitle}</p>
                        <p className="text-xs text-zinc-400">{new Date(scanResult.eventDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={resetScanner}>
                    Scan Next Participant
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 text-center">
        <p className="text-sm text-zinc-400">
          Tip: Ensure the participant's QR code is well-lit and centered in the scanning box.
        </p>
      </div>
    </div>
  );
};
