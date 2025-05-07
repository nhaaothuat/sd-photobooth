import { z } from "zod";

export const couponSchema = z
  .object({
    name: z.string().min(1, "Tên không được để trống").max(100,"Tên tối đa 100 ký tự"),
    description: z.string().max(500,"Mô tả tối đa 500 ký tự").optional(),
    code: z.string().min(1, "Mã không được yêu cầu").max(50,"Mã tối đa 50 ký tự"),
    discount: z.number().nonnegative().min(0,"Discount phải >= 0").optional(),
    discountPercent: z.preprocess(
      (val) => parseFloat(val as string),
      z.number()
        .nonnegative("DiscountPercent phải >= 0")
        .max(1, "DiscountPercent tối đa là 1")
        .refine((val) => {
          const decimalPlaces = val.toString().split(".")[1]?.length || 0;
          return decimalPlaces <= 4;
        }, { message: "DiscountPercent chỉ cho phép tối đa 4 chữ số sau dấu phẩy" })
    ).optional(),
    startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
    endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
    maxUse: z.coerce.number().min(1, "Số lượt sử dụng tối đa phải >= 1").optional(),
    maxDiscount: z.coerce.number().min(0, "MaxDiscount phải >= 0").optional(),
    minOrder: z.coerce.number().min(0,"MinOrder must be >= 0 / MinOrder phải >= 0").optional(),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const hasDiscount = (data.discount ?? 0) > 0;
    const hasDiscountPercent = (data.discountPercent ?? 0) > 0;

    if (!hasDiscount && !hasDiscountPercent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Phải nhập một trong hai: 'Discount' hoặc 'DiscountPercent' với giá trị lớn hơn 0",
        path: ["discount"],
      });
    }

    if (hasDiscount && hasDiscountPercent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Chỉ được nhập một trong hai: 'Discount' hoặc 'DiscountPercent'",
        path: ["discount"],
      });
    }

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start > end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
          path: ["startDate"],
        });
      }
    }
  });
