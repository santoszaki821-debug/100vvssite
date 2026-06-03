import { PrismaClient, ProfileTheme, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const founderPassword = process.env.FOUNDER_PASSWORD ?? 'ChangeMe100vvs!';
  const founderPasswordHash = await argon2.hash(founderPassword, { type: argon2.argon2id });
  const badges = [
    { key: 'verified', label: 'Verifie', color: '#3b82f6', icon: 'badge-check', description: 'Identite confirmee' },
    { key: 'founder', label: 'Fondateur', color: '#8f1327', icon: 'crown', description: 'Createur officiel de 100vvs' },
    { key: 'member', label: 'Membre', color: '#f2a6b4', icon: 'sparkle', description: 'Membre de la communaute privee' },
    { key: 'premium', label: 'Premium', color: '#111827', icon: 'gem', description: 'Profil premium' },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({ where: { key: badge.key }, update: badge, create: badge });
  }

  const founder = await prisma.user.upsert({
    where: { username: '100vvs' },
    update: {
      role: Role.FOUNDER,
      passwordHash: founderPasswordHash,
      profile: {
        upsert: {
          update: {
            displayName: '100vvs',
            avatarUrl: '/avatar-founder.svg',
            bannerUrl: '/banner-premium.svg',
            bio: 'Createur de la communaute privee 100vvs.',
            status: 'Fondateur',
            nameColor: '#c084fc',
            messageFrame: 'founder',
            profileStyle: 'signature',
            theme: ProfileTheme.PREMIUM,
            visibleBadges: ['verified', 'founder', 'premium'],
          },
          create: {
            displayName: '100vvs',
            avatarUrl: '/avatar-founder.svg',
            bannerUrl: '/banner-premium.svg',
            bio: 'Createur de la communaute privee 100vvs.',
            status: 'Fondateur',
            nameColor: '#c084fc',
            messageFrame: 'founder',
            profileStyle: 'signature',
            theme: ProfileTheme.PREMIUM,
            visibleBadges: ['verified', 'founder', 'premium'],
          },
        },
      },
    },
    create: {
      username: '100vvs',
      role: Role.FOUNDER,
      passwordHash: founderPasswordHash,
      profile: {
        create: {
          displayName: '100vvs',
          avatarUrl: '/avatar-founder.svg',
          bannerUrl: '/banner-premium.svg',
          bio: 'Createur de la communaute privee 100vvs.',
          status: 'Fondateur',
            nameColor: '#c084fc',
          messageFrame: 'founder',
          profileStyle: 'signature',
          theme: ProfileTheme.PREMIUM,
          visibleBadges: ['verified', 'founder', 'premium'],
        },
      },
    },
  });

  for (const key of ['verified', 'founder', 'premium']) {
    const badge = await prisma.badge.findUniqueOrThrow({ where: { key } });
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: founder.id, badgeId: badge.id } },
      update: {},
      create: { userId: founder.id, badgeId: badge.id },
    });
  }

  const channels = [
    ['general', 'Discussion generale', 'Le salon central de 100vvs.'],
    ['presentations', 'Presentations', 'Presentez votre pseudonyme et votre univers.'],
    ['medias', 'Medias', 'Images, GIF et contenus visuels.'],
    ['hors-sujet', 'Hors sujet', 'Discussions libres et anonymes.'],
  ];
  for (const [slug, name, description] of channels) {
    await prisma.channel.upsert({ where: { slug }, update: { name, description }, create: { slug, name, description } });
  }
}

main().finally(async () => prisma.$disconnect());
