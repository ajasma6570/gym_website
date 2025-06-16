import { prisma } from "@/lib/prisma";

export async function checkDuplicateMember(name: string, phone: string) {
  return prisma.member.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      phone,
      isDeleted: false,
    },
  });
}
