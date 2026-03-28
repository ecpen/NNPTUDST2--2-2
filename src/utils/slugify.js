/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành không dấu và tạo slug
 * VD: "Điện thoại Samsung" -> "dien-thoai-samsung"
 */
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function slugify(title) {
  if (!title) return "";

  let slug = removeVietnameseTones(title);

  slug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // Loại bỏ dấu gạch ngang liên tiếp
    .replace(/^-+|-+$/g, ""); // Xóa dấu gạch ngang ở đầu và cuối

  return slug;
}

module.exports = slugify;
