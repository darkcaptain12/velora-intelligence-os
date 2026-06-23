import type { EventCategory, Prisma } from '@prisma/client';
import { prisma } from '../client';

/** Global Event Calendar — ticari önemi olan etkinlikler (Opportunity'nin EVENT kaynağı). */
export const events = {
  /** Etkinliği oluşturur/günceller (brandId+name+eventDate benzersiz — idempotent günlük tarama). */
  upsert: (input: {
    brandId: string;
    name: string;
    category: EventCategory;
    eventDate: Date;
    prepLeadDays: number;
    trendPotential: number;
    salesPotential: number;
    eventScore?: unknown;
  }) =>
    prisma.commercialEvent.upsert({
      where: {
        brandId_name_eventDate: {
          brandId: input.brandId,
          name: input.name,
          eventDate: input.eventDate,
        },
      },
      create: {
        brandId: input.brandId,
        name: input.name,
        category: input.category,
        eventDate: input.eventDate,
        prepLeadDays: input.prepLeadDays,
        trendPotential: input.trendPotential,
        salesPotential: input.salesPotential,
        eventScore: (input.eventScore ?? undefined) as Prisma.InputJsonValue | undefined,
      },
      update: {
        category: input.category,
        prepLeadDays: input.prepLeadDays,
        trendPotential: input.trendPotential,
        salesPotential: input.salesPotential,
        eventScore: (input.eventScore ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    }),

  /** Etkinlik Takvimi sayfası — tüm etkinlikler, tarihe göre sıralı. */
  list: (brandId: string, take = 100) =>
    prisma.commercialEvent.findMany({
      where: { brandId },
      orderBy: { eventDate: 'asc' },
      take,
    }),

  /** Yaklaşan etkinlikler (Komuta Merkezi widget). Geçmiş etkinlikleri hariç tutar. */
  upcoming: (brandId: string, take = 5) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return prisma.commercialEvent.findMany({
      where: { brandId, eventDate: { gte: today } },
      orderBy: { eventDate: 'asc' },
      take,
    });
  },

  /** Hazırlık penceresine girdiğinde oluşturulan Opportunity'ye bağlar (idempotency anahtarı). */
  linkOpportunity: (id: string, opportunityId: string) =>
    prisma.commercialEvent.update({
      where: { id },
      data: { linkedOpportunityId: opportunityId },
    }),
};
