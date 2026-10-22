import { orders } from "./data.js";

// Shared calculation helper: calculate the value of all items in one order.
export const orderTotal = ({ items }) =>
  items.reduce((sum, { price, qty }) => sum + price * qty, 0);

// 9. Return new order objects with a total. Original orders are not changed.
export const withTotals = (ordersToUse = orders) =>
  ordersToUse.map((order) => ({ ...order, total: orderTotal(order) }));

// 10. Revenue counts delivered orders only.
export const totalRevenue = (ordersToUse = orders) =>
  ordersToUse
    .filter(({ status }) => status === "delivered")
    .reduce((sum, order) => sum + orderTotal(order), 0);

// 11. Ignore null ratings; return 0 when there are no ratings.
export const averageRating = (ordersToUse = orders) => {
  const ratedOrders = ordersToUse.filter(({ rating }) => rating !== null);
  if (ratedOrders.length === 0) return 0;

  const ratingSum = ratedOrders.reduce(
    (sum, { rating }) => sum + rating,
    0,
  );

  return Math.round((ratingSum / ratedOrders.length) * 10) / 10;
};

// 12. Count Brochette quantity across every order, as requested in the drill.
export const brochettesSold = (ordersToUse = orders) =>
  ordersToUse
    .flatMap(({ items }) => items)
    .filter(({ name }) => name === "Brochette")
    .reduce((sum, { qty }) => sum + qty, 0);

// 13. Return the order with the largest total, or undefined for an empty array.
export const mostExpensiveOrder = (ordersToUse = orders) =>
  ordersToUse.reduce(
    (best, order) =>
      !best || orderTotal(order) > orderTotal(best) ? order : best,
    undefined,
  );

// 14. Count orders by status. Object.groupBy is available in modern runtimes.
export const ordersByStatus = (ordersToUse = orders) =>
  Object.fromEntries(
    Object.entries(Object.groupBy(ordersToUse, ({ status }) => status))
      .map(([status, groupedOrders]) => [status, groupedOrders.length]),
  );

// 15. Revenue by district from delivered orders only.
export const revenueByDistrict = (ordersToUse = orders) =>
  ordersToUse
    .filter(({ status }) => status === "delivered")
    .reduce((totals, order) => {
      const district = order.customer.district;
      return {
        ...totals,
        [district]: (totals[district] ?? 0) + orderTotal(order),
      };
    }, {});

// 16. Group by date; show order count and delivered revenue for each date.
export const dailySummary = (ordersToUse = orders) =>
  Object.entries(
    Object.groupBy(ordersToUse, ({ date }) => date),
  ).map(([date, dailyOrders]) => ({
    date,
    count: dailyOrders.length,
    revenue: totalRevenue(dailyOrders),
  }));

// 17. Rank menu items by quantity across all order records.
export const bestSellingItems = (ordersToUse = orders) =>
  Object.values(
    ordersToUse
      .flatMap(({ items }) => items)
      .reduce((itemsByName, { name, qty }) => ({
        ...itemsByName,
        [name]: {
          name,
          qty: (itemsByName[name]?.qty ?? 0) + qty,
        },
      }), {}),
  ).toSorted((a, b) => b.qty - a.qty);

// 18. Summarise each customer's order count and total spend.
// "Spent" is the value of all their order records, regardless of status.
export const customerSummaries = (ordersToUse = orders) =>
  Object.values(
    ordersToUse.reduce((customers, order) => {
      const name = order.customer.name;
      const current = customers[name] ?? { name, orders: 0, spent: 0 };

      return {
        ...customers,
        [name]: {
          ...current,
          orders: current.orders + 1,
          spent: current.spent + orderTotal(order),
        },
      };
    }, {}),
  ).toSorted((a, b) => b.spent - a.spent);

// 19. Build a menu price list. If a dish appears more than once, keep its first price.
export const menuPriceList = (ordersToUse = orders) =>
  Object.fromEntries(
    ordersToUse
      .flatMap(({ items }) => items)
      .reduce(
        (uniqueItems, item) =>
          uniqueItems.some(({ name }) => name === item.name)
            ? uniqueItems
            : [...uniqueItems, item],
        [],
      )
      .map(({ name, price }) => [name, price]),
  );

// 20. Mark an order delivered only if it currently is pending.
export const markDelivered = (ordersToUse, id) =>
  ordersToUse.map((order) =>
    order.id === id && order.status === "pending"
      ? { ...order, status: "delivered" }
      : order,
  );

// 21. Only delivered orders can be rated. Otherwise return the same array reference.
export const rateOrder = (ordersToUse, id, rating) => {
  const target = ordersToUse.find(({ id: orderId }) => orderId === id);
  if (!target || target.status !== "delivered") return ordersToUse;

  return ordersToUse.map((order) =>
    order.id === id ? { ...order, rating } : order,
  );
};

// 22. Update the nested customer object immutably.
export const changeDistrict = (ordersToUse, id, district) =>
  ordersToUse.map((order) =>
    order.id === id
      ? { ...order, customer: { ...order.customer, district } }
      : order,
  );

// 23. Copy the matching order and its items array before adding an item.
export const addItem = (ordersToUse, id, item) =>
  ordersToUse.map((order) =>
    order.id === id
      ? { ...order, items: [...order.items, { ...item }] }
      : order,
  );

// 24. Return a new array without cancelled orders.
export const removeCancelled = (ordersToUse) =>
  ordersToUse.filter(({ status }) => status !== "cancelled");

// 25. Return new orders, item arrays and item objects with discounted prices.
// Prices are rounded to the nearest whole number.
export const applyDiscount = (ordersToUse, percent) =>
  ordersToUse.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      price: Math.round(item.price * (1 - percent / 100)),
    })),
  }));
