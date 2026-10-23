import { orders } from "./data.js";
import {
  orderTotal,
  withTotals,
  totalRevenue,
  averageRating,
  brochettesSold,
  mostExpensiveOrder,
  ordersByStatus,
  revenueByDistrict,
  dailySummary,
  bestSellingItems,
  customerSummaries,
  menuPriceList,
  markDelivered,
  rateOrder,
  changeDistrict,
  addItem,
  removeCancelled,
  applyDiscount,
} from "./helpers.js";

const ORIGINAL = JSON.stringify(orders);

// STATION 1 — Warm-up (1–8)
console.log("\nSTATION 1 — WARM-UP");

// 1. Array of all order ids.
console.log("1:", orders.map(({ id }) => id));

// 2. Customer names (duplicates allowed).
console.log("2:", orders.map(({ customer: { name } }) => name));

// 3. All delivered orders.
console.log("3:", orders.filter(({ status }) => status === "delivered"));

// 4. All orders from Gasabo.
console.log(
  "4:",
  orders.filter(({ customer: { district } }) => district === "Gasabo"),
);

// 5. The order with id 106.
console.log("5:", orders.find(({ id }) => id === 106));

// 6. Does any order have a rating of 3 or lower?
console.log(
  "6:",
  orders.some(({ rating }) => rating !== null && rating <= 3),
);

// 7. Are all pending orders unrated? (filter + every)
console.log(
  "7:",
  orders
    .filter(({ status }) => status === "pending")
    .every(({ rating }) => rating === null),
);

// 8. Unique customer names.
console.log(
  "8:",
  [...new Set(orders.map(({ customer: { name } }) => name))],
);

// STATION 2 — Calculations with reduce (9–14)
console.log("\nSTATION 2 — REDUCE");

// 9. Add a total to every order, returning new objects.
console.log("9:", withTotals());

// 10. Delivered revenue only.
console.log("10:", totalRevenue());

// 11. Average rating, ignoring null, rounded to one decimal.
console.log("11:", averageRating());

// 12. Total quantity of Brochettes across all orders.
console.log("12:", brochettesSold());

// 13. The single most expensive order by order total.
console.log("13:", mostExpensiveOrder());

// 14. Number of orders per status.
console.log("14:", ordersByStatus());

// STATION 3 — Grouping & ranking (15–19)
console.log("\nSTATION 3 — GROUPING & RANKING");

// 15. Delivered revenue per district.
console.log("15:", revenueByDistrict());

// 16. Daily count and delivered revenue.
console.log("16:", dailySummary());

// 17. Top 3 items by quantity.
console.log("17:", bestSellingItems().slice(0, 3));

// 18. Customer order counts and spend, sorted by spend.
console.log("18:", customerSummaries());

// 19. Menu price list.
console.log("19:", menuPriceList());

// STATION 4 — Immutable updates (20–25)
console.log("\nSTATION 4 — IMMUTABLE UPDATES");

// 20. Mark pending order 105 as delivered.
const afterMarkDelivered = markDelivered(orders, 105);
console.log("20:", afterMarkDelivered.find(({ id }) => id === 105));

// 21. Rate delivered order 101; a pending order cannot be rated.
console.log("21a:", rateOrder(orders, 101, 4).find(({ id }) => id === 101));
console.log(
  "21b pending unchanged:",
  rateOrder(orders, 105, 2) === orders,
);

// 22. Change the district on order 102.
console.log(
  "22:",
  changeDistrict(orders, 102, "Gasabo").find(({ id }) => id === 102),
);

// 23. Add an item to order 101.
console.log(
  "23:",
  addItem(orders, 101, { name: "Water", price: 500, qty: 1 }).find(
    ({ id }) => id === 101,
  ),
);

// 24. Remove cancelled orders.
console.log("24:", removeCancelled(orders));

// 25. Apply a 10% discount to all item prices.
console.log("25:", applyDiscount(orders, 10));

// Immutability proof: this must print true.
console.log(
  "\nOriginal orders unchanged:",
  JSON.stringify(orders) === ORIGINAL,
);

// Additional helper examples for practice.
console.log("\nOrder 101 total:", orderTotal(orders.find(({ id }) => id === 101)));
