export const PROJECT_STATUS_LABEL: Record<string, string> = {
  "dang-trien-khai": "Đang triển khai",
  "dang-ban": "Đang mở bán",
  "da-ban-giao": "Đã bàn giao",
  "sap-mo-ban": "Sắp mở bán",
  "da-hoan-thanh": "Đã hoàn thành",
  "chuan-bi-mo-ban": "Chuẩn bị mở bán",
};

export function projectStatusLabel(status: string): string {
  return PROJECT_STATUS_LABEL[status] ?? status;
}
