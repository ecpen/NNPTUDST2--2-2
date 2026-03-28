/**
 * Middleware validate khi tạo/cập nhật product
 * - title, price, description không được để trống
 * - price phải là số
 */
function validateProduct(req, res, next) {
  const { title, price, description } = req.body;
  const errors = [];

  if (!title || String(title).trim() === "") {
    errors.push("Title không được để trống");
  }

  if (price === undefined || price === null || String(price).trim() === "") {
    errors.push("Price không được để trống");
  } else if (isNaN(Number(price))) {
    errors.push("Price phải là số");
  } else if (Number(price) < 0) {
    errors.push("Price phải >= 0");
  }

  if (!description || String(description).trim() === "") {
    errors.push("Description không được để trống");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Ép kiểu price sang number
  req.body.price = Number(price);

  next();
}

/**
 * Middleware validate query params cho GET /products
 * - page, limit phải là số nguyên dương (nếu có)
 * - maxPrice phải >= minPrice (nếu cả hai đều có)
 */
function validateQuery(req, res, next) {
  const { page, limit, minPrice, maxPrice } = req.query;
  const errors = [];

  if (page !== undefined) {
    const p = Number(page);
    if (!Number.isInteger(p) || p < 1) {
      errors.push("page phải là số nguyên dương");
    }
  }

  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l < 1) {
      errors.push("limit phải là số nguyên dương");
    }
  }

  if (minPrice !== undefined) {
    if (isNaN(Number(minPrice))) {
      errors.push("minPrice phải là số");
    }
  }

  if (maxPrice !== undefined) {
    if (isNaN(Number(maxPrice))) {
      errors.push("maxPrice phải là số");
    }
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    !isNaN(Number(minPrice)) &&
    !isNaN(Number(maxPrice)) &&
    Number(maxPrice) < Number(minPrice)
  ) {
    errors.push("maxPrice phải lớn hơn hoặc bằng minPrice");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = { validateProduct, validateQuery };
