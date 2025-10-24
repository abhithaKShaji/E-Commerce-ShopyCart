import React from "react";
import CountBox from "../../features/adminDashboard/components/CountBox";
import PaymentChart from "../../features/adminDashboard/components/PaymentChart";
import OrderStatusChart from "../../features/adminDashboard/components/OrderStatusChart";
import RecentUsersTable from "../../features/adminDashboard/components/RecentUsersTable";
import { FaUsers, FaTruck, FaBoxes, FaChartLine } from "react-icons/fa";

// Hooks
import { useAllUsers } from "../../features/adminDashboard/hooks/useTotalUsers";
import { useOrders } from "../../features/adminOrder/hooks/useAdminOrders";
import { useTotalProducts } from "../../features/adminDashboard/hooks/useTotalProducts";
import { usePaymentCounts } from "../../features/adminDashboard/hooks/usePaymentsCount";
import { useOrderStatusCounts } from "../../features/adminDashboard/hooks/useOrderStatusCount";
import { useTotalRevenue } from "../../features/adminDashboard/hooks/useTotalRevenue";

// Skeleton components
const SkeletonBox: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-300 animate-pulse rounded ${className}`} />
);

const Dashboard: React.FC = () => {
  const { totalUsers, loading: usersLoading, error: usersError } = useAllUsers();
  const { totalOrders } = useOrders();
  const { totalProducts } = useTotalProducts();
  const { paymentCounts, loading: paymentLoading, error: paymentError } = usePaymentCounts();
  const { counts: orderStatusCounts, loading: statusLoading, error: statusError } = useOrderStatusCounts();
  const { totalRevenue, error: revenueError } = useTotalRevenue();

  const orderStatus = [
    { status: "Placed", total: orderStatusCounts.placed },
    { status: "Shipped", total: orderStatusCounts.shipped },
    { status: "Delivered", total: orderStatusCounts.delivered },
    { status: "Cancelled", total: orderStatusCounts.cancelled },
  ];

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {usersLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonBox key={idx} className="h-24 w-full" />
            ))
          ) : (
            <>
              <CountBox icon={<FaUsers />} count={totalUsers} label="Total Users" />
              <CountBox icon={<FaTruck />} count={totalOrders} label="Total Orders" />
              <CountBox icon={<FaBoxes />} count={totalProducts} label="Total Products" />
              <CountBox icon={<FaChartLine />} count={`₹${totalRevenue}`} label="Total Revenue" />
            </>
          )}
        </div>
        {revenueError && <p className="text-red-500 mb-4">{revenueError}</p>}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {paymentLoading ? (
            <SkeletonBox className="h-64 w-full" />
          ) : paymentError ? (
            <p className="text-red-500">{paymentError}</p>
          ) : (
            <PaymentChart paymentMethods={paymentCounts} />
          )}

          {statusLoading ? (
            <SkeletonBox className="h-64 w-full" />
          ) : statusError ? (
            <p className="text-red-500">{statusError}</p>
          ) : (
            <OrderStatusChart orderStatus={orderStatus} />
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white p-4 sm:p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          {usersLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonBox key={idx} className="h-10 w-full mb-2" />
            ))
          ) : usersError ? (
            <p className="text-red-500">{usersError}</p>
          ) : (
            <RecentUsersTable pageSize={5} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
