/** Nav items tạm ẩn khỏi header (desktop + mobile) trong khi dữ liệu chưa đầy đủ.
 *  Bật lại: xoá key khỏi Set này (hoặc để rỗng `new Set()`). */
export const HIDDEN_NAV_KEYS: ReadonlySet<string> = new Set(["so-sanh", "phap-ly"]);
