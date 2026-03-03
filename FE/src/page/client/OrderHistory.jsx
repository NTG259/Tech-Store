import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";

const imgMicroBackpack = "https://placehold.co/160x160/f5f5f5/333333/png?text=Micro+Backpack";
const imgNomadTote = "https://placehold.co/160x160/f5f5f5/333333/png?text=Nomad+Tote";
const imgDoubleStackBag = "https://placehold.co/160x160/f5f5f5/333333/png?text=Stack+Bag";

/* ─── Status badge ─── */
const BADGE_COLORS = {
  Success: { bg: "#34c759", text: "#f9f9f9" },
  Pending: { bg: "#f59e0b", text: "#fff" },
  Shipping: { bg: "#3b82f6", text: "#fff" },
  Delivered: { bg: "#6366f1", text: "#fff" },
  Canceled: { bg: "#ff383c", text: "#efeff1" },
};

function StatusBadge({ status }) {
  const c = BADGE_COLORS[status] || BADGE_COLORS.Confirmed;
  return (
    <span
      className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

/* ─── Order Header Row ─── */
function OrderHeader({ orderNumber, datePlaced, total, status }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-6 border-b border-[#e5e7eb] gap-4 sm:gap-0">
      <div className="flex flex-wrap gap-4 sm:gap-6">
        <div className="flex flex-col gap-1 w-[121px]">
          <p className="text-sm font-medium text-[#111827]">Order number</p>
          <p className="text-sm text-[#6b7280]">{orderNumber}</p>
        </div>
        <div className="flex flex-col gap-1 w-[121px]">
          <p className="text-sm font-medium text-[#111827]">Date placed</p>
          <p className="text-sm text-[#6b7280]">{datePlaced}</p>
        </div>
        <div className="flex flex-col gap-1 w-[121px]">
          <p className="text-sm font-medium text-[#111827]">Total amount</p>
          <p className="text-sm font-medium text-[#111827]">{total}</p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

/* ─── Order Product Row ─── */
function OrderProduct({ image, name, price, description, quantity, first }) {
  return (
    <div className={`flex flex-col sm:flex-row items-start p-6 ${!first ? "border-t border-[#e5e7eb]" : ""} gap-6`}>
      <div className="w-full sm:w-[160px] h-[160px] bg-[#e5e7eb] rounded-lg overflow-hidden shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 w-full">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm font-medium text-[#111827]">{name}</p>
          <p className="text-sm font-medium text-[#111827]">{price}</p>
        </div>
        <p className="text-sm text-[#6b7280] leading-5 mb-4">{description}</p>
        {/* Quantity display added here */}
        <p className="text-sm font-medium text-[#111827]">Quantity: {quantity}</p>
      </div>
    </div>
  );
}

/* ─── Order Card ─── */
function OrderCard({ orderNumber, datePlaced, total, status, products }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm overflow-hidden">
      <OrderHeader
        orderNumber={orderNumber}
        datePlaced={datePlaced}
        total={total}
        status={status}
      />
      {products.map((p, i) => (
        <OrderProduct key={p.name} {...p} first={i === 0} />
      ))}
    </div>
  );
}

/* ─── Orders data ─── */
const ORDERS = [
  {
    orderNumber: "WU88191111",
    datePlaced: "Jul 6, 2021",
    total: "$160.00",
    status: "Success",
    products: [
      {
        image: imgMicroBackpack,
        name: "Micro Backpack",
        price: "$70.00",
        quantity: 2, // Added quantity
        description:
          "Are you a minimalist looking for a compact carry option? The Micro Backpack is the perfect size for your essential everyday carry items. Wear it like a backpack or carry it like a satchel for all-day use.",
      },
      {
        image: imgNomadTote,
        name: "Nomad Shopping Tote",
        price: "$90.00",
        quantity: 2, // Added quantity
        description:
          "This durable shopping tote is perfect for the world traveler. Its yellow canvas construction is water, fray, tear resistant. The matching handle, backpack straps, and shoulder loops provide multiple carry options for a day out on your next adventure.",
      },
    ],
  },
  {
    orderNumber: "AT48441546",
    datePlaced: "Dec 22, 2020",
    total: "$40.00",
    status: "Success",
    products: [
      {
        image: imgDoubleStackBag,
        name: "Double Stack Clothing Bag",
        price: "$40.00",
        quantity: 2, // Added quantity
        description:
          "Save space and protect your favorite clothes in this double-layer garment bag. Each compartment easily holds multiple pairs of jeans or tops, while keeping your items neatly folded throughout your trip.",
      },
    ],
  },
];

/* ─── Main Page ─── */
const OrderHistory = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header Placeholder */}
      <Header></Header>

      <main className="max-w-[1170px] mx-auto px-4 py-10 w-full flex-1">
        <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.75px] mb-8">
          Order history
        </h1>

        <div className="flex flex-col gap-8">
          {ORDERS.map((order) => (
            <OrderCard key={order.orderNumber} {...order} />
          ))}
        </div>
      </main>

      {/* Footer Placeholder */}
      <Footer></Footer>
    </div>
  );
}

export default OrderHistory;