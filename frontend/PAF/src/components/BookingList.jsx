import { InboxIcon } from "@heroicons/react/24/outline";
import BookingCard from "./BookingCard";

const BookingList = ({
  bookings,
  onCancel,
  onApprove,
  onReject,
  isAdmin = false,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500">No bookings found</h3>
        <p className="text-sm text-gray-400 mt-1">
          Bookings will appear here once created.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onCancel={onCancel}
          onApprove={onApprove}
          onReject={onReject}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default BookingList;
