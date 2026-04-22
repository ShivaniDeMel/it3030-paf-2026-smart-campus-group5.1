import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const BookingQRCode = ({ booking, facilityName }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const encodeToken = (value) => {
    const bytes = new TextEncoder().encode(value);
    let binary = '';

    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary);
  };

  useEffect(() => {
    if (!booking?.id) return;

    const generateQRCode = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Generating QR for booking:', booking.id);

        // Create booking data string with essential information
        const bookingData = {
          id: booking.id,
          facilityId: booking.facilityId,
          facilityName: facilityName || 'Smart Campus',
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          userId: booking.userId,
          attendeeCount: booking.attendeeCount,
          purpose: booking.purpose,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          specialRequirements: booking.specialRequirements,
          equipmentRequested: booking.equipmentRequested
        };

        // Convert to URL-friendly string
        const qrValue = `${window.location.origin}/booking-details?id=${booking.id}&token=${encodeURIComponent(encodeToken(JSON.stringify(bookingData)))}`;
        console.log('QR Value length:', qrValue.length, 'URL:', qrValue.substring(0, 100) + '...');

        // Generate QR code as data URL
        const dataUrl = await QRCode.toDataURL(qrValue, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.95,
          margin: 2,
          width: 250,
          color: {
            dark: '#1a1a1a',
            light: '#ffffff'
          }
        });
        
        console.log('QR code generated successfully');
        setQrCodeUrl(dataUrl);
        setLoading(false);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
        setError(`Failed to generate QR code: ${err.message}`);
        setLoading(false);
      }
    };

    generateQRCode();
  }, [booking, facilityName]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `booking-${booking.id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900/50 rounded-lg border border-orange-600/30">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-3"></div>
          <p className="text-orange-100/60">Generating QR code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/40 bg-red-500/10 rounded-lg p-4">
        <p className="text-sm text-red-100">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 bg-linear-to-br from-gray-900/80 to-black/80 border border-orange-600/30 rounded-lg p-6">
      <h3 className="text-sm font-semibold text-orange-100/90">Booking QR Code</h3>
      
      <div className="bg-white p-4 rounded-lg shadow-lg">
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            alt="Booking QR Code"
            className="w-auto h-auto"
          />
        )}
      </div>

      <p className="text-xs text-orange-100/60 text-center max-w-xs">
        Scan this code to view booking details. Share with others to grant access to this booking information.
      </p>

      <button
        onClick={downloadQRCode}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600/80 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Download QR Code
      </button>
    </div>
  );
};

export default BookingQRCode;
