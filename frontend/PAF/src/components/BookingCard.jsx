import {
  CalendarDaysIcon,
  ClockIcon,
  BuildingOfficeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const STATUS_STYLES = {
  PENDING: {
    bg: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: ExclamationTriangleIcon,
    label: "Pending",
  },
  APPROVED: {
    bg: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircleIcon,
    label: "Approved",
  },
  REJECTED: {
    bg: "bg-red-100 text-red-800 border-red-300",
    icon: XCircleIcon,
    label: "Rejected",
  },
  CANCELLED: {
    bg: "bg-gray-100 text-gray-800 border-gray-300",
    icon: XCircleIcon,
    label: "Cancelled",
  },
};

const BookingCard = ({ booking, onCancel, onApprove, onReject, isAdmin = false }) => {
  const statusConfig = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className={`px-5 py-3 flex items-center justify-between ${statusConfig.bg} border-b`}>
        <div className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          <span className="font-semibold text-sm">{statusConfig.label}</span>
        </div>
        <span className="text-xs opacity-75">
          {booking.createdAt && new Date(booking.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <BuildingOfficeIcon className="h-5 w-5 text-orange-500" />
          {booking.facilityName}
        </h3>

        {isAdmin && (
          <p className="text-sm text-gray-500">
            Booked by: <span className="font-medium text-gray-700">{booking.userName}</span>
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDaysIcon className="h-4 w-4 text-orange-500" />
          <span>{booking.bookingDate}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 text-orange-500" />
          <span>
            {booking.startClock} - {booking.endClock}
          </span>
        </div>

        <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
          <span className="font-medium text-orange-700">Purpose:</span>{" "}
          {booking.purpose || "N/A"}
        </p>
      </div>

      <div className="px-5 pb-5 flex gap-2">
        {isAdmin && booking.status === "PENDING" && (
          <>
            <button
              onClick={() => onApprove(booking.id)}
              className="flex-1 py-2 px-4 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-1"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Approve
            </button>
            <button
              onClick={() => onReject(booking.id)}
              className="flex-1 py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-1"
            >
              <XCircleIcon className="h-4 w-4" />
              Reject
            </button>
          </>
        )}

        {!isAdmin && booking.status === "PENDING" && (
          <button
            onClick={() => onCancel(booking.id)}
            className="flex-1 py-2 px-4 bg-gray-500 text-white text-sm font-medium rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-1"
          >
            <TrashIcon className="h-4 w-4" />
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
