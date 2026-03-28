const Product = require("../models/Product");

// GET /api/products - Lấy danh sách sản phẩm (hỗ trợ page, limit, minPrice, maxPrice, slug)
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, minPrice, maxPrice, slug } = req.query;

    // Nếu query theo slug -> trả về 1 sản phẩm (check equal)
    if (slug) {
      const product = await Product.findOne({ slug });
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm với slug này" });
      }
      return res.json({ success: true, data: product });
    }

    // Xây dựng filter theo giá
    const filter = {};
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:slug - Lấy sản phẩm theo slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products - Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const product = await Product.create({ title, price, description });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Slug đã tồn tại, hãy đổi title khác" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:slug - Cập nhật sản phẩm theo slug
exports.updateProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { title, price, description },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Slug đã tồn tại, hãy đổi title khác" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:slug - Xóa sản phẩm theo slug
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ slug: req.params.slug });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
