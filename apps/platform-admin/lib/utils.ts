/**
 * 脱敏敏感手机号 (如: 138****1234)
 */
export function maskPhone(phone?: string | null): string {
  if (!phone) return "-";
  if (phone.length < 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

/**
 * 脱敏统一社会信用代码/营业执照
 */
export function maskUnifiedCode(code?: string | null): string {
  if (!code) return "-";
  if (code.length < 8) return code;
  return code.substring(0, 4) + "**********" + code.substring(code.length - 4);
}
