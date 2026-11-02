import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { dataAwal } from "./data-awal";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  for (const data of dataAwal) {
    const { temuanAwal, ...targetData } = data;

    const target = await prisma.target.upsert({
      where: { targetUrl: targetData.targetUrl },
      update: {},
      create: targetData,
    });

    for (const temuan of temuanAwal) {
      await prisma.temuan.upsert({
        where: {
          targetId_findingId: {
            targetId: target.id,
            findingId: temuan.findingId,
          },
        },
        update: {},
        create: {
          targetId: target.id,
          findingId: temuan.findingId,
          title: temuan.title,
          category: temuan.category,
          severity: temuan.severity,
          description: temuan.description,
          remediation: temuan.remediation,
          cwe: temuan.cwe,
          asvsRef: temuan.asvsRef,
        },
      });
    }
  }

  const jTarget = await prisma.target.count();
  const jTemuan = await prisma.temuan.count();
  console.log(`Seed selesai: ${jTarget} target, ${jTemuan} temuan`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
