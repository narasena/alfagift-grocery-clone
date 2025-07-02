import { DiscountValueType, Prisma, VoucherType } from "../generated/prisma";
import { prisma } from "../prisma";

async function createReferralSeed() {
  const referrerUserId = "0b833ac1-ce89-436e-bc90-69f8c2509d11";
  const referrerReferralCode = "T70YDG2BR9";
  const refereeUserId = "15b8dae9-0344-4080-9dfb-da841b83e20f";
  
  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const referral = await tx.referral.create({
        data: {
          referrerId: referrerUserId,
          refereeId: refereeUserId,
        },
      });
      
      const voucher = await tx.voucher.create({
        data: {
          name: `Referral Voucher [${referrerReferralCode}]`,
          voucherType: VoucherType.REFERRAL,
          discountValueType: DiscountValueType.PERCENTAGE,
          discountValue: 10,
          userId: refereeUserId,
          referralId: referral.id,
          expiredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });
      
      return { referral, voucher };
    });
    
    console.log("✅ Referral and voucher created successfully:", result);
  } catch (error) {
    
    console.error("❌ Error creating referral:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
createReferralSeed();