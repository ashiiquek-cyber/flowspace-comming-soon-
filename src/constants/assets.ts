/** Photographs ship as responsive WebP (see scripts/optimize-images.py); this is the largest variant */
const photo = (hash: string) => `/assets/${hash}-1600.webp`;

const PHOTO_WIDTHS = [640, 1024, 1600];

/** srcset for a photograph from ASSETS, or undefined for anything else (icons, team portraits, external URLs) */
export const srcSet = (src: string): string | undefined =>
  src.endsWith('-1600.webp')
    ? PHOTO_WIDTHS.map((w) => `${src.replace(/-1600\.webp$/, `-${w}.webp`)} ${w}w`).join(', ')
    : undefined;

export const ASSETS = {
  iconPlus: "/assets/0d92ca663dd6e3c4c790a8504e70384f66ed1ab1.svg",
  iconMinus: "/assets/3222dafac5425662a944a58f725f40f6e3242ff9.svg",
  iconArrowRightWhite: "/assets/6484d3caf2c74be3b3e3f6871fcc3dcfb53df446.svg",
  iconArrowRightDark: "/assets/9b0f57fecd801e894030105b72c829dbb38805b2.svg",
  heroBg: photo("5596c55e83bc3c525d01c87829e04436132527af"),
  projectCloudHouse: photo("82f0e227aa443d2e098e223df7de2bbb9ecad89e"),
  projectTerraVilla: photo("6829a4f792e04728bb305d9a367972c4bae7b886"),
  projectHover: photo("ffb20f25f9cb1edf3a378cd8fa2643035be41443"),
  projectInterior: photo("8941276ab91f9a3b0b1bde992841222014cb43b0"),
  clientAvatar: "/assets/9037759ce636ea3d863e6f8d1f9945e9a92d2d11.svg",
  authorAvatar: "/assets/41592cfc812c3139ef1eaf86157227b79b0f8ada.svg",
  authorAvatarLg: "/assets/e1a641ed04e5066f0d659b4858ad871c77a0c49f.svg",
  emblemWhite: "/assets/b75d359e15ef44a2a6cabaaa813c97996a54b2d8.svg",
  emblemOrange: "/assets/b6102b37863908917bb68c8b2b5604553ed609a4.svg",
  emblemDark: "/assets/bbd7dad9379c60d43be936c3a977484077badde5.svg",
  iconWhatsapp: "/assets/5b3241bcc4318e2408320a816d48e8d3144fdf7e.svg",
  founderPhoto: photo("7155325e22fad3760a9e6f94f38d125f0e51cea8"),
  iconDrag: "/assets/fb6fe17392caf53874ee69f0a30e664782d0d49f.svg",
  portraitRashid: "/assets/team/rashid-ali.jpg",
  avatarRashid: "/assets/team/rashid-ali-avatar.jpg",
  portraitAmana: "/assets/team/amana-fida.jpg",
};
