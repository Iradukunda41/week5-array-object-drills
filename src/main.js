import "../src/style.css";
import { orders } from "../data.js";
import {
  withTotals,
  totalRevenue,
  averageRating,
  bestSellingItems,
  revenueByDistrict,
} from "../helpers.js";

const state = { filter: "all" };
const ordersWithTotals = withTotals();
const bestItem = bestSellingItems()[0];
const districtRevenue = revenueByDistrict();
const highestDistrictRevenue = Math.max(...Object.values(districtRevenue), 1);

const money = (value) =>
  `RWF ${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const statusClasses = {
  delivered: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-rose-100 text-rose-800",
};

document.querySelector("#app").innerHTML = `
  <div class="min-h-screen">
    <header class="bg-slate-900 text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">Kigali Eats</p>
          <h1 class="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Orders dashboard</h1>
          <p class="mt-2 text-slate-300">Week 5 · Array & Object Manipulation Drills</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
          <p class="text-sm text-slate-300">Orders in dataset</p>
          <p class="text-2xl font-bold">${orders.length}</p>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl space-y-8 px-5 py-8 lg:px-8">
      <section aria-label="Key statistics" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Delivered revenue</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">${money(totalRevenue())}</p>
          <p class="mt-2 text-sm text-slate-500">Delivered orders only</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Delivered orders</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">${orders.filter(({ status }) => status === "delivered").length}</p>
          <p class="mt-2 text-sm text-slate-500">Successfully completed</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Average rating</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">${averageRating().toFixed(1)} <span class="text-amber-500">★</span></p>
          <p class="mt-2 text-sm text-slate-500">Null ratings excluded</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Best-selling item</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">${bestItem?.name ?? "N/A"}</p>
          <p class="mt-2 text-sm text-slate-500">${bestItem?.qty ?? 0} units across order records</p>
        </article>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-slate-900">Revenue by district</h2>
          <p class="mt-1 text-sm text-slate-500">Delivered orders only</p>
        </div>
        <div class="space-y-5">
          ${Object.entries(districtRevenue).map(([district, value]) => `
            <div>
              <div class="mb-2 flex items-center justify-between gap-4 text-sm">
                <span class="font-semibold text-slate-700">${district}</span>
                <span class="font-semibold text-slate-900">${money(value)}</span>
              </div>
              <div class="h-3 overflow-hidden rounded-full bg-slate-100">
                <div class="h-full rounded-full bg-orange-500" style="width: ${(value / highestDistrictRevenue) * 100}%"></div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Orders</h2>
            <p id="table-description" class="mt-1 text-sm text-slate-500">Showing all orders</p>
          </div>
          <div id="filter-buttons" class="flex flex-wrap gap-2">
            ${["all", "delivered", "pending", "cancelled"].map((filter) => `
              <button
                type="button"
                data-filter="${filter}"
                class="filter-button rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition"
              >${filter}</button>
            `).join("")}
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-left">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Order</th>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Customer</th>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">District</th>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Total</th>
                <th class="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody id="orders-body" class="divide-y divide-slate-100 bg-white"></tbody>
          </table>
        </div>
      </section>

      <p class="pb-3 text-center text-sm text-slate-500">Built with JavaScript array methods, immutable helpers, Vite and Tailwind CSS v4.</p>
    </main>
  </div>
`;

function renderOrders() {
  const filteredOrders = state.filter === "all"
    ? ordersWithTotals
    : ordersWithTotals.filter(({ status }) => status === state.filter);

  document.querySelector("#table-description").textContent =
    `Showing ${filteredOrders.length} ${state.filter === "all" ? "" : state.filter + " "}order${filteredOrders.length === 1 ? "" : "s"}`;

  document.querySelector("#orders-body").innerHTML = filteredOrders.length
    ? filteredOrders.map(({ id, customer, total, status }) => `
      <tr class="transition hover:bg-slate-50">
        <td class="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">#${id}</td>
        <td class="whitespace-nowrap px-5 py-4 text-slate-700">${customer.name}</td>
        <td class="whitespace-nowrap px-5 py-4 text-slate-700">${customer.district}</td>
        <td class="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">${money(total)}</td>
        <td class="whitespace-nowrap px-5 py-4">
          <span class="inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClasses[status] ?? "bg-slate-100 text-slate-700"}">${status}</span>
        </td>
      </tr>
    `).join("") // innerHTML is acceptable here because this workshop uses a fixed, trusted local dataset.
    : `<tr><td colspan="5" class="px-5 py-10 text-center text-slate-500">No orders match this filter.</td></tr>`;

  document.querySelectorAll(".filter-button").forEach((button) => {
    const active = button.dataset.filter === state.filter;
    button.className = `filter-button rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition ${
      active
        ? "border-orange-600 bg-orange-600 text-white"
        : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700"
    }`;
    button.setAttribute("aria-pressed", String(active));
  });
}

document.querySelector("#filter-buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;

  state.filter = button.dataset.filter;
  renderOrders();
});

renderOrders();
