
 // ==========================================
 // 1. IMPORTS
 // ==========================================
import "./style.css";
import { orders } from "../data.js";

import {
  withTotals,
  totalRevenue,
  averageRating,
  bestSellingItems,
  revenueByDistrict,
} from "../helpers.js";

// ==========================================
// 2. APPLICATION STATE
// ==========================================
const state = {
  filter: "all",
};

// ==========================================
// 3. PREPARE DASHBOARD DATA
// ==========================================
const ordersWithTotals = withTotals();
const bestItem = bestSellingItems()[0];
const districtRevenue = revenueByDistrict();

const highestDistrictRevenue = Math.max(
  ...Object.values(districtRevenue),
  1
);

// ==========================================
// 4. FORMAT CURRENCY
// ==========================================
const money = (value) =>
  `RWF ${Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;

// ==========================================
// 5. ORDER STATUS STYLES
// ==========================================
const statusClasses = {
  delivered: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-rose-100 text-rose-800",
};

// ==========================================
// 6. MAIN DASHBOARD LAYOUT
// ==========================================
document.querySelector("#app").innerHTML = `
  <div class="min-h-screen bg-slate-50">

    <!-- HEADER -->
    <header class="bg-slate-900 text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">

        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
            Kigali Eats
          </p>

          <h1 class="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Kigali Eats Dashboard
          </h1>

          <p class="mt-2 text-slate-300">
            Your food orders, deliveries, and sales in one place.
          </p>
        </div>

        <!-- TOTAL ORDERS -->
        <div class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
          <p class="text-sm text-slate-300">Total orders</p>
          <p class="text-2xl font-bold">${orders.length}</p>
        </div>

      </div>
    </header>

    <main class="mx-auto max-w-7xl space-y-8 px-5 py-8 lg:px-8">

      <!-- ======================================== -->
      <!-- 7. DASHBOARD STATISTICS CARDS -->
      <!-- ======================================== -->
      <section
        aria-label="Kigali Eats sales statistics"
        class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >

        <!-- Delivered revenue -->
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">
            Delivered Revenue
          </p>
          <p class="mt-3 text-2xl font-bold text-slate-900">
            ${money(totalRevenue())}
          </p>
          <p class="mt-2 text-sm text-slate-500">
            Revenue from completed orders
          </p>
        </article>

        <!-- Number of delivered orders -->
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">
            Delivered Orders
          </p>
          <p class="mt-3 text-2xl font-bold text-slate-900">
            ${orders.filter(({ status }) => status === "delivered").length}
          </p>
          <p class="mt-2 text-sm text-slate-500">
            Successfully completed deliveries
          </p>
        </article>

        <!-- Average customer rating -->
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">
            Average Customer Rating
          </p>
          <p class="mt-3 text-2xl font-bold text-slate-900">
            ${averageRating().toFixed(1)}
            <span class="text-amber-500">★</span>
          </p>
          <p class="mt-2 text-sm text-slate-500">
            Based on submitted ratings
          </p>
        </article>

        <!-- Best-selling food -->
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">
            Best-Selling Food
          </p>
          <p class="mt-3 text-2xl font-bold text-slate-900">
            ${bestItem?.name ?? "N/A"}
          </p>
          <p class="mt-2 text-sm text-slate-500">
            ${bestItem?.qty ?? 0} units in the order records
          </p>
        </article>

      </section>

      <!-- ======================================== -->
      <!-- 8. REVENUE BY DISTRICT -->
      <!-- ======================================== -->
      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div class="mb-6">
          <h2 class="text-xl font-bold text-slate-900">
            Sales by District
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Delivered-order revenue across Kigali
          </p>
        </div>

        <!-- Create a bar for each district -->
        <div class="space-y-5">
          ${
            Object.entries(districtRevenue)
              .map(([district, value]) => `
                <div>
                  <div class="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span class="font-semibold text-slate-700">
                      ${district}
                    </span>
                    <span class="font-semibold text-slate-900">
                      ${money(value)}
                    </span>
                  </div>

                  <div class="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      class="h-full rounded-full bg-orange-500"
                      style="width: ${(value / highestDistrictRevenue) * 100}%"
                    ></div>
                  </div>
                </div>
              `)
              .join("")
          }
        </div>
      </section>

      <!-- ======================================== -->
      <!-- 9. CUSTOMER ORDERS AND FILTERS -->
      <!-- ======================================== -->
      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div class="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div>
            <h2 class="text-xl font-bold text-slate-900">
              Customer Orders
            </h2>
            <p
              id="table-description"
              class="mt-1 text-sm text-slate-500"
            >
              View and manage customer orders.
            </p>
          </div>

          <!-- Order status filter buttons -->
          <div id="filter-buttons" class="flex flex-wrap gap-2">
            ${["all", "delivered", "pending", "cancelled"]
              .map((filter) => `
                <button
                  type="button"
                  data-filter="${filter}"
                  class="filter-button rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition"
                >
                  ${filter === "all" ? "All Orders" : filter}
                </button>
              `)
              .join("")}
          </div>
        </div>

        <!-- ====================================== -->
        <!-- 10. RESPONSIVE ORDERS TABLE -->
        <!-- ====================================== -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-left">

            <!-- Table headings -->
            <thead class="bg-slate-50">
              <tr>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Order ID
                </th>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Customer
                </th>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  District
                </th>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Order Total
                </th>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <!-- JavaScript inserts the orders here -->
            <tbody
              id="orders-body"
              class="divide-y divide-slate-100 bg-white"
            ></tbody>

          </table>
        </div>
      </section>

    </main>

    <!-- ======================================== -->
    <!-- 11. FOOTER -->
    <!-- ======================================== -->
    <footer class="mt-10 border-t border-slate-200 bg-white px-5 py-8 text-center">

      <p class="text-sm font-semibold text-slate-700">
        © 2026 Kigali Eats. Fresh food, delicious meals, happy customers.
      </p>

      <p class="mt-2 text-sm text-slate-500">
        Your trusted food ordering platform in Kigali, Rwanda.
      </p>

      <p class="mt-2 text-xs text-slate-400">
        Bringing great food and happy customers together.
      </p>

    </footer>

  </div>
`;

// ==========================================
// 12. RENDER ORDERS
// Filter and display orders in the table.
// ==========================================
function renderOrders() {
  // Apply the selected status filter.
  const filteredOrders =
    state.filter === "all"
      ? ordersWithTotals
      : ordersWithTotals.filter(
          ({ status }) => status === state.filter
        );

  // Update the table description.
  const description =
    state.filter === "all"
      ? `Showing all ${filteredOrders.length} orders`
      : `Showing ${filteredOrders.length} ${state.filter} orders`;

  document.querySelector("#table-description").textContent =
    description;

  // Render the matching orders or an empty-state message.
  document.querySelector("#orders-body").innerHTML =
    filteredOrders.length > 0
      ? filteredOrders
          .map(({ id, customer, total, status }) => `
            <tr class="transition hover:bg-slate-50">

              <!-- Order ID -->
              <td class="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                #${id}
              </td>

              <!-- Customer name -->
              <td class="whitespace-nowrap px-5 py-4 text-slate-700">
                ${customer.name}
              </td>

              <!-- Customer district -->
              <td class="whitespace-nowrap px-5 py-4 text-slate-700">
                ${customer.district}
              </td>

              <!-- Order total -->
              <td class="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                ${money(total)}
              </td>

              <!-- Order status -->
              <td class="whitespace-nowrap px-5 py-4">
                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    statusClasses[status] ?? "bg-slate-100 text-slate-700"
                  }"
                >
                  ${status}
                </span>
              </td>

            </tr>
          `)
          .join("")
      : `
        <tr>
          <td
            colspan="5"
            class="px-5 py-10 text-center text-slate-500"
          >
            No orders found for this status.
          </td>
        </tr>
      `;

  // ========================================
  // 13. UPDATE FILTER BUTTON STYLES
  // ========================================
  // Highlight the active button for the selected filter.
  document.querySelectorAll(".filter-button").forEach((button) => {
    const isActive = button.dataset.filter === state.filter;

    button.className = `
      filter-button rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition
      ${
        isActive
          ? "border-orange-600 bg-orange-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700"
      }
    `;

    button.setAttribute("aria-pressed", String(isActive));
  });
}

// ==========================================
// 14. FILTER BUTTON EVENT LISTENER
// ==========================================
// Update the filter when a user clicks a button.
document
  .querySelector("#filter-buttons")
  .addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");

    // Ignore clicks outside the filter buttons.
    if (!button) return;

    state.filter = button.dataset.filter;
    renderOrders();
  });

// ==========================================
// 15. INITIAL DASHBOARD RENDER
// ==========================================
// Show all orders when the dashboard first loads.
renderOrders();
