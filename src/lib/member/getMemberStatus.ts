export function getStatusFromPlanDuration(
  paymentStart: string | Date,
  duration: number
): {
  isActive: boolean;
  expiryDate: Date;
  daysLeft: number;
} {
  const startDate = new Date(paymentStart);
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + duration);

  const today = new Date();
  const daysLeft = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isActive = today <= expiryDate;

  return { isActive, expiryDate, daysLeft };
}