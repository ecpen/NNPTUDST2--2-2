const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title không được để trống"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price không được để trống"],
      min: [0, "Price phải >= 0"],
    },
    description: {
      type: String,
      required: [true, "Description không được để trống"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Tự động tạo slug từ title trước khi save
productSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
});

// Tự động cập nhật slug khi update title
productSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title);
  }
});

module.exports = mongoose.model("Product", productSchema);
