import React, {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input} from "@/components/ui/input";

export type CharacterData = {
  src: string;
  modalsrc: string;
  collectionsrc: string;
  rarity: "none" | "common" | "rare" | "superrare";
  name_en: string;
  name_ko?: string;
  codename: string;
  affinity: "Cleave" | "Fire" | "Ice" | "Elec" | "Wind" | "Psi" | "Nuclear" | "Bless" | "Curse" | "Support";
  id: number;
};

export type WeaponData = {
  src: string;
  modalsrc: string;
  collectionsrc: string;
  rarity: "none" | "standard" | "rare" | "superrare";
  name_en: string;
  name_ko?: string;
  assChara: number;
  id: number;
}

function makeIcon(name: string) {
  return {
    src: new URL(`../assets/chicons/${name}.png`, import.meta.url).href,
    modalsrc: new URL(`../assets/chicons/modal/${name}.png`, import.meta.url).href,
    collectionsrc: new URL(`../assets/chicons/collection/${name}.png`, import.meta.url).href
  };
}

function makePersonaIcon(name: string) {
  return {
    src: new URL(`../assets/persicons/${name}.png`, import.meta.url).href,
    modalsrc: new URL(`../assets/persicons/modal/${name}.png`, import.meta.url).href,
    collectionsrc: new URL(`../assets/chicons/collection/${name}.png`, import.meta.url).href
  };
}

function makeWeaponIcon(name: string) {
  return {
    src: new URL(`../assets/persicons/modal/basic.png`, import.meta.url).href,
    modalsrc: new URL(`../assets/chicons/weapon/${name}.png`, import.meta.url).href,
    collectionsrc: new URL(`../assets/chicons/weapon/collection/${name}.png`, import.meta.url).href
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const availableCharacters: CharacterData[] = [
  { ...makeIcon("ren"), rarity: "superrare", name_en: "Ren Amamiya", name_ko: "아마미야 렌", codename: "Joker", affinity: "Curse", id: 1261 },
  { ...makeIcon("yui"), rarity: "superrare", name_en: "Yui", name_ko: "YUI", codename: "Bui", affinity: "Elec", id: 1111 },
  { ...makeIcon("minami"), rarity: "superrare", name_en: "Minami Miyashita", name_ko: "미야시타 미나미", codename: "Marian", affinity: "Bless", id: 1231 },
  { ...makeIcon("yusuke"), rarity: "superrare", name_en: "Yusuke Kitagawa", name_ko: "키타가와 유스케", codename: "Fox", affinity: "Ice", id: 1161 },
  { ...makeIcon("makoto"), rarity: "superrare", name_en: "Makoto Nijima", name_ko: "니지마 마코토", codename: "Queen", affinity: "Nuclear", id: 1201 },
  { ...makeIcon("yumi"), rarity: "superrare", name_en: "Yumi Shiina", name_ko: "시이나 유우미", codename: "Phoebe", affinity: "Support", id: 1311 },
  { ...makeIcon("ayaka"), rarity: "superrare", name_en: "Ayaka Sakai", name_ko: "사카이 아야카", codename: "Chord", affinity: "Elec", id: 1321 },

  { ...makeIcon("morgana"), rarity: "superrare", name_en: "Morgana", name_ko: "모르가나", codename: "Mona", affinity: "Wind", id: 1021 },
  { ...makeIcon("ryuji"), rarity: "superrare", name_en: "Ryuji Sakamoto", name_ko: "사카모토 류지", codename: "Skull", affinity: "Cleave", id: 1011 },
  { ...makeIcon("ann"), rarity: "superrare", name_en: "Ann Takamaki", name_ko: "타카마키 안", codename: "Panther", affinity: "Fire", id: 1191 },
  { ...makeIcon("yaoling"), rarity: "superrare", name_en: "Yaoling Li", name_ko: "리 야오링", codename: "Rin", affinity: "Curse", id: 1091 },
  { ...makeIcon("haruna"), rarity: "superrare", name_en: "Haruna Nishimori", name_ko: "니시모리 하루나", codename: "Riddle", affinity: "Psi", id: 1281 },

  { ...makeIcon("lufel"), rarity: "rare", name_en: "Lufel", name_ko: "루페르", codename: "Cattle", affinity: "Fire", id: 1041 },
  { ...makeIcon("motoha"), rarity: "rare", name_en: "Motoha Arai", name_ko: "아라이 모토하", codename: "Closer", affinity: "Elec", id: 1031 },
  { ...makeIcon("shun"), rarity: "rare", name_en: "Shun Kano", name_ko: "카노 슌", codename: "Soy", affinity: "Ice", id: 1061 },
  { ...makeIcon("leo"), rarity: "rare", name_en: "Leo Kamiyama", name_ko: "카미야마 레오", codename: "Leon", affinity: "Nuclear", id: 1071 },
  { ...makeIcon("kayo"), rarity: "rare", name_en: "Kayo Tomiyama", name_ko: "토미야마 카요", codename: "Okyaan", affinity: "Support", id: 1081 },
  { ...makeIcon("tomoko"), rarity: "rare", name_en: "Tomoko Noge", name_ko: "노게 토모코", codename: "Moko", affinity: "Psi", id: 1101 },
  { ...makeIcon("kiyoshi"), rarity: "rare", name_en: "Kiyoshi Kurotani", name_ko: "쿠로타니 키요시", codename: "Key", affinity: "Fire", id: 1121 },
  { ...makeIcon("yukimi"), rarity: "rare", name_en: "Yukimi Fujikawa", name_ko: "후지카와 유키미", codename: "Yuki", affinity: "Bless", id: 1131 },
  { ...makeIcon("seiji"), rarity: "rare", name_en: "Seiji Shiratori", name_ko: "시라토리 세이지", codename: "Fleuret", affinity: "Wind", id: 1141 },
  { ...makeIcon("toshiya"), rarity: "rare", name_en: "Toshiya Sumi", name_ko: "스미 토시야", codename: "Sepia", affinity: "Curse", id: 1181 },
  { ...makeIcon("kotone"), rarity: "rare", name_en: "Kotone Montagne", name_ko: "코토네 몽타뉴", codename: "Mont", affinity: "Ice", id: 1211 },
  { ...makeIcon("miyu"), rarity: "rare", name_en: "Miyu Sahara", name_ko: "사하라 미유", codename: "Puppet", affinity: "Support", id: 1271 },
  { ...makeIcon("chizuko"), rarity: "rare", name_en: "Chizuko Nagao", name_ko: "나가오 치즈코", codename: "Vino", affinity: "Nuclear", id: 1301 },
  { ...makeIcon("riko"), rarity: "rare", name_en: "Riko Tanemura", name_ko: "타네무라 리코", codename: "Wind", affinity: "Support", id: 1051 },


    /*
  { ...makeIcon("shoki"), rarity: "rare", name_en: "Shoki Ikenami", name_ko: "이케나미 쇼키", codename: "Luce", affinity: "Bless", id: 1221 },

  { ...makeIcon("akihiko"), rarity: "superrare", name_en: "Akihiko Sanada", name_ko: "사나다 아키히코", codename: "Akihiko", affinity: "Elec", id: 1411 },
  { ...makeIcon("runa"), rarity: "superrare", name_en: "Runa Dogenzaka", name_ko: "도겐자카 루우나", codename: "Howler", affinity: "Fire", id: 1341 },
  { ...makeIcon("mayumi"), rarity: "superrare", name_en: "Mayumi Hashimoto", name_ko: "하시모토 마유미", codename: "Turbo", affinity: "Cleave", id: 1361 },


     */
  /* Cleave */
  { ...makePersonaIcon("inugami"), rarity: "common", name_en: "Inugami", name_ko: "이누가미", codename: "N/A", affinity: "Cleave", id: 157 },
  { ...makePersonaIcon("ippon_datara"), rarity: "common", name_en: "Ippon-Datara", name_ko: "잇폰다타라", codename: "N/A", affinity: "Cleave", id: 183 },
  { ...makePersonaIcon("mandrake"), rarity: "common", name_en: "Mandrake", name_ko: "맨드레이크", codename: "N/A", affinity: "Cleave", id: 163 },
  { ...makePersonaIcon("mokoi"), rarity: "common", name_en: "Mokoi", name_ko: "모코이", codename: "N/A", affinity: "Cleave", id: 129 },

  /* Fire */
  { ...makePersonaIcon("hua_po"), rarity: "common", name_en: "Hua Po", name_ko: "화백", codename: "N/A", affinity: "Fire", id: 178  },
  { ...makePersonaIcon("orobas"), rarity: "common", name_en: "Orobas", name_ko: "오로바스",  codename: "N/A", affinity: "Fire", id: 184  },
  { ...makePersonaIcon("pyrojack"), rarity: "common", name_en: "Jack-o'-Lantern", name_ko: "잭 오 랜턴", codename: "N/A", affinity: "Fire", id: 111  },

  /* Ice */
  { ...makePersonaIcon("andras"), rarity: "common", name_en: "Andras", name_ko: "안드라스", codename: "N/A", affinity: "Ice", id: 224  },
  { ...makePersonaIcon("apsaras"), rarity: "common", name_en: "Apsaras", name_ko: "아프사라스", codename: "N/A", affinity: "Ice", id: 192 },
  { ...makePersonaIcon("koropokguru"), rarity: "common", name_en: "Koropokguru", name_ko: "코로포클", codename: "N/A", affinity: "Ice", id: 179  },
  { ...makePersonaIcon("kushi_mitama"), rarity: "common", name_en: "Kushi Mitama", name_ko: "쿠시미타마", codename: "N/A", affinity: "Ice", id: 250  },
  { ...makePersonaIcon("saki_mitama"), rarity: "common", name_en: "Saki Mitama", name_ko: "사키미타마", codename: "N/A", affinity: "Ice", id: 221  },

  /* Wind */
  { ...makePersonaIcon("bicorn"), rarity: "common", name_en: "Bicorn", name_ko: '바이콘', codename: "N/A", affinity: "Wind", id: 117 },
  { ...makePersonaIcon("high_pixie"), rarity: "common", name_en: "High Pixie", name_ko: "하이픽시", codename: "N/A", affinity: "Wind", id: 166 },
  { ...makePersonaIcon("kelpie"), rarity: "common", name_en: "Kelpie", name_ko: "켈피", codename: "N/A", affinity: "Wind", id: 220 },
  { ...makePersonaIcon("kodama"), rarity: "common", name_en: "Kodama", name_ko: "코다마", codename: "N/A", affinity: "Wind", id: 193 },
  { ...makePersonaIcon("koppa_tengu"), rarity: "common", name_en: "Koppa Tengu", name_ko: '콧파텐구', codename: "N/A", affinity: "Wind", id: 180 },
  { ...makePersonaIcon("nekomata"), rarity: "common", name_en: "Nekomata", name_ko: "네코마타", codename: "N/A", affinity: "Wind", id: 185 },
  { ...makePersonaIcon("sudama"), rarity: "common", name_en: "Sudama", name_ko: "스다마", codename: "N/A", affinity: "Wind", id: 154 },

  /* Elec */
  { ...makePersonaIcon("agathion"), rarity: "common", name_en: "Agathion", name_ko: "아가시온", codename: "N/A", affinity: "Elec", id: 116  },
  { ...makePersonaIcon("pixie"), rarity: "common", name_en: "Pixie", name_ko: "픽시", codename: "N/A", affinity: "Elec", id: 156  },
  { ...makePersonaIcon("shiisa"), rarity: "common", name_en: "Shiisa", name_ko: "시사", codename: "N/A", affinity: "Elec", id: 194 },

  /* Psi */

  /* Nuclear */
  { ...makePersonaIcon("makami"), rarity: "common", name_en: "Makami", name_ko: "마카미", codename: "N/A", affinity: "Nuclear", id: 165 },
  { ...makePersonaIcon("suzaku"), rarity: "common", name_en: "Suzaku", name_ko: "주작", codename: "N/A", affinity: "Nuclear", id: 143 },

  /* Bless */
  { ...makePersonaIcon("nigi_mitama"), rarity: "common", name_en: "Nigi Mitama", name_ko: "니기미타마", codename: "N/A", affinity: "Bless", id: 226 },

  /* Curse */
  { ...makePersonaIcon("onmoraki"), rarity: "common", name_en: "Onmoraki", name_ko: "온모라키", codename: "N/A", affinity: "Curse", id: 182 },
  { ...makePersonaIcon("slime"), rarity: "common", name_en: "Slime", name_ko: '슬라임', codename: "N/A", affinity: "Curse", id: 225 },

  // Add more characters here as needed
  { ...makeIcon("basic"), rarity: "none", name_en: "Clear", codename: "N/A", affinity: "Support", id: 9999 },
];

export const availableWeapons: WeaponData[] = [
  /* 5-Star Weapons */
  { ...makeWeaponIcon("ren-5"), rarity: "superrare", name_en: "Phoenix Dagger", name_ko: "불사조", assChara: 1261, id: 212604 },
  { ...makeWeaponIcon("yui-5"), rarity: "superrare", name_en: "Cyber Jammers", name_ko: "버츄얼 디스럽터", assChara: 1111, id: 211104 },
  { ...makeWeaponIcon("minami-5"), rarity: "superrare", name_en: "Angel Heart", name_ko: "엔젤 하트", assChara: 1231, id: 212304 },
  { ...makeWeaponIcon("yusuke-5"), rarity: "superrare", name_en: "Shadowkiller", name_ko: "금빛 그림자", assChara: 1161, id: 211604 },
  { ...makeWeaponIcon("makoto-5"), rarity: "superrare", name_en: "Nuclear Finisher", name_ko: '종말의 핵열', assChara: 1201, id: 212004 },
  { ...makeWeaponIcon("yumi-5"), rarity: "superrare", name_en: "Moonlit Feather", name_ko: "월하의 깃털", assChara: 1311, id: 213104 },
  { ...makeWeaponIcon("ayaka-5"), rarity: "superrare", name_en: "Superstar", name_ko: "샤이닝 스타", assChara: 1321, id: 213204 },

  { ...makeWeaponIcon("morgana-5"), rarity: "superrare", name_en: "Golden Legacy", name_ko: "골든 스포일", assChara: 1021, id: 210204 },
  { ...makeWeaponIcon("ryuji-5"), rarity: "superrare", name_en: "Revenge Axe", name_ko: "복수자의 송곳니", assChara: 1011, id: 210104 },
  { ...makeWeaponIcon("ann-5"), rarity: "superrare", name_en: "Rosethorn", name_ko: "장미의 가시", assChara: 1191, id: 211904 },
  { ...makeWeaponIcon("yaoling-5"), rarity: "superrare", name_en: "Infinite Moment", name_ko: "하늘의 일념", assChara: 1091, id: 210904 },
  { ...makeWeaponIcon("haruna-5"), rarity: "superrare", name_en: "Sweet Pickaxe", name_ko: "스위트 하트", assChara: 1281, id: 212804 },
  { ...makeWeaponIcon("lufel-5"), rarity: "superrare", name_en: "Fallen Angel Wing", name_ko: "소울 글로리", assChara: 1041, id: 210404 },
  { ...makeWeaponIcon("motoha-5"), rarity: "superrare", name_en: "Quasar", name_ko: "일렉트릭 스타즈", assChara: 1031, id: 210304 },
  { ...makeWeaponIcon("shun-5"), rarity: "superrare", name_en: "Permafrost", name_ko: "선구자의 얼음도끼", assChara: 1061, id: 210604 },
  { ...makeWeaponIcon("leo-5"), rarity: "superrare", name_en: "Final Buster", name_ko: "디스트로이어 MR", assChara: 1071, id: 210704},
  { ...makeWeaponIcon("kayo-5"), rarity: "superrare", name_en: "Retro Disco Style", name_ko: "빈티지 디스코:P", assChara: 1081, id: 210804 },
  { ...makeWeaponIcon("tomoko-5"), rarity: "superrare", name_en: "Dream and Nightmare", assChara: 1101, id: 211004 },
  { ...makeWeaponIcon("kiyoshi-5"), rarity: "superrare", name_en: "Baptism by Fire", name_ko: "빛의 세례", assChara: 1121, id: 211204 },
  { ...makeWeaponIcon("yukimi-5"), rarity: "superrare", name_en: "Karmic Cycle", name_ko: "퍼플 샐베이션", assChara: 1131, id: 211304 },
  { ...makeWeaponIcon("seiji-5"), rarity: "superrare", name_en: "Venus Sunrise", name_ko: "계몽의 별", assChara: 1141, id: 211404 },
  { ...makeWeaponIcon("toshiya-5"), rarity: "superrare", name_en: "Babel's Verdict", name_ko: "데스 세이지", assChara: 1181, id: 211804 },
  { ...makeWeaponIcon("kotone-5"), rarity: "superrare", name_en: "Queen of Winter", name_ko: "겨울의 여왕", assChara: 1211, id: 212104 },
  { ...makeWeaponIcon("miyu-5"), rarity: "superrare", name_en: "Ephemerality", name_ko: "버블 드림", assChara: 1271, id: 212704 },
  { ...makeWeaponIcon("chizuko-5"), rarity: "superrare", name_en: "Jolting Pulse", name_ko: "오버클럭 펄스", assChara: 1301, id: 213004 },
  { ...makeWeaponIcon("riko-5"), rarity: "superrare", name_en: "Kunoichi: Sky's Edge", name_ko: "닌자·천공의 날개", assChara: 1051, id: 210504 },


  /* 4-Star Weapons */
  { ...makeWeaponIcon("ren-4"), rarity: "rare", name_en: "Machete", name_ko: "마체테 나이프", assChara: 1261, id: 212603 },
  { ...makeWeaponIcon("yui-4"), rarity: "rare", name_en: "Meta Directors", name_ko: "미래의 계시", assChara: 1111, id: 211103 },
  { ...makeWeaponIcon("minami-4"), rarity: "rare", name_en: "Hymn of Life", assChara: 1231, id: 212303 },
  { ...makeWeaponIcon("yusuke-4"),rarity: "rare", name_en: "Jagato", name_ko: "거합도", assChara: 1161, id: 211603 },
  { ...makeWeaponIcon("makoto-4"),rarity: "rare", name_en: "Omega Knuckle", name_ko: "마하 펀치", assChara: 1201, id: 212003 },
  { ...makeWeaponIcon("yumi-4"),rarity: "rare", name_en: "Starrynight Soothsayer", name_ko: "별밤의 점술가", assChara: 1311, id: 213103 },
  { ...makeWeaponIcon("ayaka-4"),rarity: "rare", name_en: "Rock 'n' Roller", name_ko: "로큰롤 솔로", assChara: 1321, id: 213203 },

  { ...makeWeaponIcon("morgana-4"),rarity: "rare", name_en: "Shamshir", name_ko: "샴시르", assChara: 1021, id: 210203 },
  { ...makeWeaponIcon("ryuji-4"),rarity: "rare", name_en: "Grand Presser", name_ko: "가이아 프레서", assChara: 1011, id: 210103 },
  { ...makeWeaponIcon("ann-4"),rarity: "rare", name_en: "Masquerade Ribbon", name_ko: "미라지 윕", assChara: 1191, id: 211903 },
  { ...makeWeaponIcon("yaoling-4"),rarity: "rare", name_en: "Sunstaff", name_ko: "만물의 사계", assChara: 1091, id: 210903 },
  { ...makeWeaponIcon("haruna-4"),rarity: "rare", name_en: "Chirpy Pickaxe", assChara: 1281, id: 212803 },
  { ...makeWeaponIcon("lufel-4"),rarity: "rare", name_en: "Lava Flame", name_ko: "용암의 불꽃", assChara: 1041, id: 210403 },
  { ...makeWeaponIcon("motoha-4"),rarity: "rare", name_en: "Crime and Punishment", name_ko: "죄와 벌", assChara: 1031, id: 210303 },
  { ...makeWeaponIcon("shun-4"),rarity: "rare", name_en: "Demon's Bite", name_ko: "마의 습격", assChara: 1061, id: 210603 },
  { ...makeWeaponIcon("leo-4"),rarity: "rare", name_en: "Justice Lance", name_ko: "최강 미늘창 X", assChara: 1071, id: 210703 },
  { ...makeWeaponIcon("kayo-4"),rarity: "rare", name_en: "Emerald Charmer", name_ko: "형광의 매혹 D4u", assChara: 1081, id: 210803 },
  { ...makeWeaponIcon("tomoko-4"),rarity: "rare", name_en: "Shadow Crowns", name_ko: "섀도 크라운", assChara: 1101, id: 211003 },
  { ...makeWeaponIcon("kiyoshi-4"),rarity: "rare", name_en: "Death Stinger", name_ko: "불꽃 성정", assChara: 1121, id: 211203 },
  { ...makeWeaponIcon("yukimi-4"),rarity: "rare", name_en: "Heavy Metal Pain", name_ko: "메가 카운터", assChara: 1131, id: 211303 },
  { ...makeWeaponIcon("seiji-4"),rarity: "rare", name_en: "Knight's Reward", name_ko: "수훈의 증명", assChara: 1141, id: 211403 },
  { ...makeWeaponIcon("toshiya-4"),rarity: "rare", name_en: "Scarlet Scepter", name_ko: "킬링 스칼렛", assChara: 1181, id: 211803 },
  { ...makeWeaponIcon("kotone-4"),rarity: "rare", name_en: "Edelweiss", name_ko: "태양의 노래", assChara: 1211, id: 212103 },
  { ...makeWeaponIcon("miyu-4"),rarity: "rare", name_en: "Submarine Sonar", name_ko: "바다 소나", assChara: 1271, id: 212703 },
  { ...makeWeaponIcon("chizuko-4"),rarity: "rare", name_en: "Gravitational Force", name_ko: "그래비티 소드", assChara: 1301, id: 213003 },
  { ...makeWeaponIcon("riko-4"),rarity: "rare", name_en: "Moonlight Needle", assChara: 1051, id: 210503 },

  /* 3-Star Weapons */
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Athame", assChara: 1261, id: 212602 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Electric Chakrams", assChara: 1111, id: 211102 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Portable Trauma Unit", assChara: 1231, id: 212302 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Seishiki Sword", assChara: 1161, id: 211602 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Flash Punch", assChara: 1201, id: 212002 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Peafowl Cane", assChara: 1311, id: 213102 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Amped-Up Guitar Axe", assChara: 1321,  id: 213202},

  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "God Saber", name_ko: "소닉 블레이드", assChara: 1021, id: 210202 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Gang Star", name_ko: "헤비 메이스", assChara: 1011, id: 210102 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Spike Whip", name_ko: "쇄분동", assChara: 1191, id: 211902 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Willowstaff", name_ko: '트윈 곤봉', assChara: 1091, id: 210902 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Shrill Pickaxe", name_ko: "뾰족 곡괭이", assChara: 1281, id: 212802 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Break Tonfa", name_ko: "돌격 쌍곤", assChara: 1041, id: 210402 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Lightning Hammer", name_ko: "썬더 철퇴", assChara: 1031, id: 210302 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Steel Tomahawk", name_ko: "강철 손도끼", assChara: 1061, id: 210602 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Punish Lance", name_ko: "EX 심판의 창", assChara: 1071, id: 210702 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Sweety SG", name_ko: "큐트 섹시 SG형", assChara: 1081, id: 210802 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Sharp Twinblades", name_ko: "쌍날의 아리아", assChara: 1101, id: 211002 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Holy Nail", name_ko: "석란 성정", assChara: 1121, id: 211202 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Slashing Flail", name_ko: "가시 모닝스타", assChara: 1131, id: 211302 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Elegant Rapier", name_ko: "클래식 플뢰레", assChara: 1141, id: 211402 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Noble Rod", name_ko: "노블 소드 스틱", assChara: 1181, id: 211802 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Royal Saber", name_ko: "로열 사벨", assChara: 1211, id: 212102 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "C.A. Explorer", name_ko: "C.A 정찰 부스터", assChara: 1271, id: 212702 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Cobalt Alloy Bayonet", name_ko: "전략 군용검", assChara: 1301, id: 213002 },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name_en: "Peculiar Parasol", name_ko: "토죠카사", assChara: 1051, id: 210502 }

]

// Auto-generate the map once
// eslint-disable-next-line react-refresh/only-export-components
export const IDMap: Record<number, CharacterData | WeaponData> = {
  ...Object.fromEntries(availableCharacters.map(c => [c.id, c])),
  ...Object.fromEntries(availableWeapons.map(w => [w.id, w])),
};

export const enNameMap: Record<string, CharacterData | WeaponData> = {
  ...Object.fromEntries(availableCharacters.map(c => [c.name_en, c])),
  ...Object.fromEntries(availableWeapons.map(w => [w.name_en, w])),
};

interface CharacterPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (char: CharacterData) => void;
  selectedCharacterName?: string; // or selectedCharacter?: CharacterData
}

const rarityGlow = {
  none: "shadow-md shadow-gray-100",
  common: "shadow-md shadow-gray-400",
  rare: "shadow-md shadow-yellow-500",
  superrare: "shadow-md shadow-purple-500",
};

const elementGlow = {
  Cleave: "shadow-md shadow-amber-600",
  Fire: "shadow-md shadow-red-500",
  Ice: "shadow-md shadow-blue-500",
  Elec: "shadow-md shadow-yellow-300",
  Wind: "shadow-md shadow-emerald-500",
  Psi: "shadow-md shadow-black-500",
  Nuclear: "shadow-md shadow-cyan-500",
  Bless: "shadow-md shadow-yellow-200",
  Curse: "shadow-md shadow-rose-500",
  Support: "shadow-md shadow-gray-200",
}

const CharacterPicker: React.FC<CharacterPickerProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           onSelect,
                                                           selectedCharacterName,
                                                         }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredCharacters = availableCharacters.filter((char) => {
        const labelMatch = char.name_en.toLowerCase().includes(searchQuery.toLowerCase());
        const codenameMatch =
            char.codename !== "N/A" &&
            char.codename.toLowerCase().includes(searchQuery.toLowerCase());

        return labelMatch || codenameMatch;
      }
  );

  return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
            className="max-w-md max-h-[80vh] lg:min-h-[800px] overflow-auto flex flex-col"
        >
          <DialogHeader>
            <DialogTitle>Select Character</DialogTitle>
          </DialogHeader>
          <div className="items-start">
            <div>
              <Input
                  type="text"
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search characters..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 self-start">
              {filteredCharacters.map((char, i) => {
                const isSelected = char.name_en === selectedCharacterName;
                return (
                    <div
                        key={i}
                        className={`cursor-pointer flex flex-col items-center p-2 border rounded 
                            ${char.rarity === "common" ? elementGlow[char.affinity] : rarityGlow[char.rarity]} 
                            hover:brightness-110 
                            ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                        onClick={() => {
                          onSelect(char);
                          onClose();
                        }}
                    >
                      <img
                          src={char.modalsrc}
                          alt={`Character ${i}`}
                          className="w-20 h-20 object-contain"
                          draggable={false}
                      />
                      <span className="mt-1 text-sm capitalize">{char.name_en}</span>
                    </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default CharacterPicker;
