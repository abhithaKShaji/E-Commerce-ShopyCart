import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SuccessPage: React.FC = () => {
  return (
    <section className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="container text-center">
        <div className="mb-4">
          <h4 className="text-2xl font-semibold text-gray-800">
            Your order has been submitted successfully.
          </h4>
        </div>

        <div className="flex justify-center mt-4">
          <CheckCircle className="text-green-500 w-20 h-20" />
        </div>

        <div className="mt-3">
          <h5 className="text-lg font-medium text-gray-700">
            Thank you for your purchase!
          </h5>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/order-history"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded transition duration-200"
          >
            View Orders
          </Link>
          <Link
            to="/"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-5 rounded transition duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessPage;
