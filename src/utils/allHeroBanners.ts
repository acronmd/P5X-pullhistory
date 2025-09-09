import renHero from '@/assets/heros/ren.png';
import yuiHero from '@/assets/heros/yui.png';
import yusukeHero from "@/assets/heros/yusuke.png";
import makotoHero from "@/assets/heros/makoto.png";
import yumiHero from "@/assets/heros/yumi.png"
import ayakaHero from "@/assets/heros/ayaka.png"

export type heroBanner = {
    image: string;
    label: string;
    hero: string;
    hero_id: number;
    weapon: string;
    weapon_id: number;
    start: number; // e.g. 1691062800 (seconds) or 1691062800000 (ms)
    end: number;
};

export const allHeroBanners: heroBanner[] = [
    {
        image: yuiHero,
        label: "Virtual Netizen - Minami",
        hero: "Minami Miyashita",
        hero_id: 1231,
        weapon: "Angel Heart",
        weapon_id: 212304,
        start: 1752138000,
        end: 1754532000,
    },
    {
        image: yuiHero,
        label: "Virtual Netizen - Yui",
        hero: "Yui",
        hero_id: 1111,
        weapon: "Cyber Jammers",
        weapon_id: 211104,
        start: 1752138000,
        end: 1754532000,
    },
    {
        image: yusukeHero,
        label: "Art of the Fox - Yusuke Kitagawa",
        hero: "Yusuke Kitagawa",
        hero_id: 1161,
        weapon: "Shadowkiller",
        weapon_id: 211604,
        start: 1753344000,
        end: 1755741600,
    },
    {
        image: makotoHero,
        label: "Fist of The Phantom Star - Makoto Nijima",
        hero: "Makoto Nijima",
        hero_id: 1201,
        weapon: "Nuclear Finisher",
        weapon_id: 212004,
        start: 1754298000,
        end: 1756951200,
    },
    {
        image: yumiHero,
        label: "Blissful Mix - Yumi Shiina",
        hero: "Yumi Shiina",
        hero_id: 1311,
        weapon: "Moonlit Feather",
        weapon_id: 213104,
        start: 1755763200,
        end: 1758463200,
    },
    {
        image: ayakaHero,
        label: "Dazzling Encore - Ayaka Sakai",
        hero: "Ayaka Sakai",
        hero_id: 1321,
        weapon: "Superstar",
        weapon_id: 213204,
        start: 1756976400,
        end: 1759968000,
    },
    {
        image: renHero,
        label: "The Phantom Magician - Ren Amamiya",
        hero: "Ren Amamiya",
        hero_id: 1261,
        weapon: "Phoenix Dagger",
        weapon_id: 212604,
        start: 1756976400,
        end: 1759669200,
    },
    // ... more banners
];