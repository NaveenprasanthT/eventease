import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name?: string;
  role?: "ADMIN" | "STAFF" | "EVENT_OWNER";
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role ?? "EVENT_OWNER",
    },
  });
}
