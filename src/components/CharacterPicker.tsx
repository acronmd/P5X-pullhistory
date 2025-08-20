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
  name: string;
  codename: string;
  affinity: "Cleave" | "Fire" | "Ice" | "Elec" | "Wind" | "Psi" | "Nuclear" | "Bless" | "Curse" | "Support";
};

export type WeaponData = {
  src: string;
  modalsrc: string;
  collectionsrc: string;
  rarity: "none" | "standard" | "rare" | "superrare";
  name: string;
  assChara: string;
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
    collectionsrc: new URL(`../assets/chicons/collection/basic.png`, import.meta.url).href
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const availableCharacters: CharacterData[] = [
  { ...makeIcon("ren"), rarity: "superrare", name: "Ren Amamiya", codename: "Joker", affinity: "Curse" },
  { ...makeIcon("yui"), rarity: "superrare", name: "Yui", codename: "Bui", affinity: "Elec" },
  { ...makeIcon("minami"), rarity: "superrare", name: "Minami Miyashita", codename: "Marian", affinity: "Bless" },
  { ...makeIcon("yusuke"), rarity: "superrare", name: "Yusuke Kitagawa", codename: "Fox", affinity: "Ice" },
  { ...makeIcon("makoto"), rarity: "superrare", name: "Makoto Nijima", codename: "Queen", affinity: "Nuclear" },
  { ...makeIcon("yumi"), rarity: "superrare", name: "Yumi Shiina", codename: "Phoebe", affinity: "Support" },

  { ...makeIcon("morgana"), rarity: "superrare", name: "Morgana", codename: "Mona", affinity: "Wind" },
  { ...makeIcon("ryuji"), rarity: "superrare", name: "Ryuji Sakamoto", codename: "Skull", affinity: "Cleave" },
  { ...makeIcon("ann"), rarity: "superrare", name: "Ann Takamaki", codename: "Panther", affinity: "Fire" },
  { ...makeIcon("yaoling"), rarity: "superrare", name: "Yaoling Li", codename: "Rin", affinity: "Curse" },
  { ...makeIcon("haruna"), rarity: "superrare", name: "Haruna Nishimori", codename: "Riddle", affinity: "Psi" },

  { ...makeIcon("lufel"), rarity: "rare", name: "Lufel", codename: "Cattle", affinity: "Fire" },
  { ...makeIcon("motoha"), rarity: "rare", name: "Motoha Arai", codename: "Closer", affinity: "Elec" },
  { ...makeIcon("shun"), rarity: "rare", name: "Shun Kano", codename: "Soy", affinity: "Ice" },
  { ...makeIcon("leo"), rarity: "rare", name: "Leo Kamiyama", codename: "Leon", affinity: "Nuclear" },
  { ...makeIcon("kayo"), rarity: "rare", name: "Kayo Tomiyama", codename: "Okyaan", affinity: "Support" },
  { ...makeIcon("tomoko"), rarity: "rare", name: "Tomoko Noge", codename: "Moko", affinity: "Psi" },
  { ...makeIcon("kiyoshi"), rarity: "rare", name: "Kiyoshi Kurotani", codename: "Key", affinity: "Fire" },
  { ...makeIcon("yukimi"), rarity: "rare", name: "Yukimi Fujikawa", codename: "Yuki", affinity: "Bless" },
  { ...makeIcon("seiji"), rarity: "rare", name: "Seiji Shiratori", codename: "Fleuret", affinity: "Wind" },
  { ...makeIcon("toshiya"), rarity: "rare", name: "Toshiya Sumi", codename: "Sepia", affinity: "Curse" },
  { ...makeIcon("kotone"), rarity: "rare", name: "Kotone Montagne", codename: "Mont", affinity: "Ice" },
  { ...makeIcon("miyu"), rarity: "rare", name: "Miyu Sahara", codename: "Puppet", affinity: "Support" },
  { ...makeIcon("chizuko"), rarity: "rare", name: "Chizuko Nagao", codename: "Vino", affinity: "Nuclear" },

  /* Cleave */
  { ...makePersonaIcon("inugami"), rarity: "common", name: "Inugami", codename: "N/A", affinity: "Cleave" },
  { ...makePersonaIcon("ippon_datara"), rarity: "common", name: "Ippon-Datara", codename: "N/A", affinity: "Cleave" },
  { ...makePersonaIcon("mandrake"), rarity: "common", name: "Mandrake", codename: "N/A", affinity: "Cleave" },
  { ...makePersonaIcon("mokoi"), rarity: "common", name: "Mokoi", codename: "N/A", affinity: "Cleave" },

  /* Fire */
  { ...makePersonaIcon("hua_po"), rarity: "common", name: "Hua Po", codename: "N/A", affinity: "Fire"  },
  { ...makePersonaIcon("orobas"), rarity: "common", name: "Orobas", codename: "N/A", affinity: "Fire"  },
  { ...makePersonaIcon("pyrojack"), rarity: "common", name: "Jack-o'-Lantern", codename: "N/A", affinity: "Fire"  },

  /* Ice */
  { ...makePersonaIcon("andras"), rarity: "common", name: "Andras", codename: "N/A", affinity: "Ice"  },
  { ...makePersonaIcon("apsaras"), rarity: "common", name: "Apsaras", codename: "N/A", affinity: "Ice"  },
  { ...makePersonaIcon("koropokguru"), rarity: "common", name: "Koropokguru", codename: "N/A", affinity: "Ice"  },
  { ...makePersonaIcon("kushi_mitama"), rarity: "common", name: "Kushi Mitama", codename: "N/A", affinity: "Ice"  },
  { ...makePersonaIcon("saki_mitama"), rarity: "common", name: "Saki Mitama", codename: "N/A", affinity: "Ice"  },

  /* Elec */
  { ...makePersonaIcon("agathion"), rarity: "common", name: "Agathion", codename: "N/A", affinity: "Elec"  },
  { ...makePersonaIcon("pixie"), rarity: "common", name: "Pixie", codename: "N/A", affinity: "Elec"  },
  { ...makePersonaIcon("shiisa"), rarity: "common", name: "Shiisa", codename: "N/A", affinity: "Elec"  },

  /* Wind */
  { ...makePersonaIcon("bicorn"), rarity: "common", name: "Bicorn", codename: "N/A", affinity: "Wind" },
  { ...makePersonaIcon("high_pixie"), rarity: "common", name: "High Pixie", codename: "N/A", affinity: "Wind" },
  { ...makePersonaIcon("kelpie"), rarity: "common", name: "Kelpie", codename: "N/A", affinity: "Wind" },
  { ...makePersonaIcon("kodama"), rarity: "common", name: "Kodama", codename: "N/A", affinity: "Wind" },
  { ...makePersonaIcon("koppa_tengu"), rarity: "common", name: "Koppa Tengu", codename: "N/A", affinity: "Wind" },
  { ...makePersonaIcon("nekomata"), rarity: "common", name: "Nekomata", codename: "N/A", affinity: "Wind" },
  { ...makePersonaIcon("sudama"), rarity: "common", name: "Sudama", codename: "N/A", affinity: "Wind" },

  /* Psi */

  /* Nuclear */
  { ...makePersonaIcon("makami"), rarity: "common", name: "Makami", codename: "N/A", affinity: "Nuclear" },
  { ...makePersonaIcon("suzaku"), rarity: "common", name: "Suzaku", codename: "N/A", affinity: "Nuclear" },

  /* Bless */
  { ...makePersonaIcon("nigi_mitama"), rarity: "common", name: "Nigi Mitama", codename: "N/A", affinity: "Bless" },

  /* Curse */
  { ...makePersonaIcon("onmoraki"), rarity: "common", name: "Onmoraki", codename: "N/A", affinity: "Curse" },
  { ...makePersonaIcon("slime"), rarity: "common", name: "Slime", codename: "N/A", affinity: "Curse" },

  // Add more characters here as needed
  { ...makeIcon("basic"), rarity: "none", name: "Clear", codename: "N/A", affinity: "Support" },
];

export const availableWeapons: WeaponData[] = [
  /* 5-Star Weapons */
  { ...makeWeaponIcon("ren-5"), rarity: "superrare", name: "Phoenix Dagger", assChara: "Ren Amamiya" },
  { ...makeWeaponIcon("yui-5"), rarity: "superrare", name: "Cyber Jammers", assChara: "Yui" },
  { ...makeWeaponIcon("minami-5"), rarity: "superrare", name: "Angel Heart", assChara: "Minami Miyashita" },
  { ...makeWeaponIcon("yusuke-5"), rarity: "superrare", name: "Shadowkiller", assChara: "Yusuke Kitagawa" },
  { ...makeWeaponIcon("makoto-5"), rarity: "superrare", name: "Nuclear Finisher", assChara: "Makoto Nijima" },

  { ...makeWeaponIcon("morgana-5"), rarity: "superrare", name: "Golden Legacy", assChara: "Morgana" },
  { ...makeWeaponIcon("ryuji-5"), rarity: "superrare", name: "Revenge Axe", assChara: "Ryuji Sakamoto" },
  { ...makeWeaponIcon("ann-5"), rarity: "superrare", name: "Rosethorn", assChara: "Ann Takamaki" },
  { ...makeWeaponIcon("yaoling-5"), rarity: "superrare", name: "Infinite Moment", assChara: "Yaoling Li" },
  { ...makeWeaponIcon("haruna-5"), rarity: "superrare", name: "Sweet Pickaxe", assChara: "Haruna Nishimori" },
  { ...makeWeaponIcon("lufel-5"), rarity: "superrare", name: "Fallen Angel Wing", assChara: "Lufel" },
  { ...makeWeaponIcon("motoha-5"), rarity: "superrare", name: "Quasar", assChara: "Motoha Arai" },
  { ...makeWeaponIcon("shun-5"), rarity: "superrare", name: "Permafrost", assChara: "Shun Kano" },
  { ...makeWeaponIcon("leo-5"), rarity: "superrare", name: "Final Buster", assChara: "Leo Kamiyama" },
  { ...makeWeaponIcon("kayo-5"), rarity: "superrare", name: "Retro Disco Style", assChara: "Kayo Tomiyama" },
  { ...makeWeaponIcon("tomoko-5"), rarity: "superrare", name: "Dream and Nightmare", assChara: "Tomoko Noge" },
  { ...makeWeaponIcon("kiyoshi-5"), rarity: "superrare", name: "Baptism by Fire", assChara: "Kiyoshi Kurotani" },
  { ...makeWeaponIcon("yukimi-5"), rarity: "superrare", name: "Karmic Cycle", assChara: "Yukimi Fujikawa" },
  { ...makeWeaponIcon("seiji-5"), rarity: "superrare", name: "Venus Sunrise", assChara: "Seiji Shiratori" },
  { ...makeWeaponIcon("toshiya-5"), rarity: "superrare", name: "Babel's Verdict", assChara: "Toshiya Sumi" },
  { ...makeWeaponIcon("kotone-5"), rarity: "superrare", name: "Queen of Winter", assChara: "Kotone Montagne" },
  { ...makeWeaponIcon("miyu-5"), rarity: "superrare", name: "Ephemerality", assChara: "Miyu Sahara" },
  { ...makeWeaponIcon("chizuko-5"), rarity: "superrare", name: "Jolting Pulse", assChara: "Chizuko Nagao" },

  /* 4-Star Weapons */
  { ...makeWeaponIcon("ren-4"), rarity: "rare", name: "Machete", assChara: "Ren Amamiya" },
  { ...makeWeaponIcon("yui-4"), rarity: "rare", name: "Meta Directors", assChara: "Yui" },
  { ...makeWeaponIcon("minami-4"), rarity: "rare", name: "Hymn of Life", assChara: "Minami Miyashita" },
  { ...makeWeaponIcon("usuke-4"),rarity: "rare", name: "Jagato", assChara: "Yusuke Kitagawa" },
  { ...makeWeaponIcon("makoto-4"),rarity: "rare", name: "Omega Knuckle", assChara: "Makoto Nijima" },

  { ...makeWeaponIcon("morgana-4"),rarity: "rare", name: "Shamshir", assChara: "Morgana" },
  { ...makeWeaponIcon("ryuji-4"),rarity: "rare", name: "Grand Presser", assChara: "Ryuji Sakamoto" },
  { ...makeWeaponIcon("ann-4"),rarity: "rare", name: "Masquerade Ribbon", assChara: "Ann Takamaki" },
  { ...makeWeaponIcon("yaoling-4"),rarity: "rare", name: "Sunstaff", assChara: "Yaoling Li" },
  { ...makeWeaponIcon("haruna-4"),rarity: "rare", name: "Chirpy Pickaxe", assChara: "Haruna Nishimori" },
  { ...makeWeaponIcon("lufel-4"),rarity: "rare", name: "Lava Flame", assChara: "Lufel" },
  { ...makeWeaponIcon("motoha-4"),rarity: "rare", name: "Crime and Punishment", assChara: "Motoha Arai" },
  { ...makeWeaponIcon("shun-4"),rarity: "rare", name: "Demon's Bite", assChara: "Shun Kano" },
  { ...makeWeaponIcon("leo-4"),rarity: "rare", name: "Justice Lance", assChara: "Leo Kamiyama" },
  { ...makeWeaponIcon("kayo-4"),rarity: "rare", name: "Emerald Charmer", assChara: "Kayo Tomiyama" },
  { ...makeWeaponIcon("tomoko-4"),rarity: "rare", name: "Shadow Crowns", assChara: "Tomoko Noge" },
  { ...makeWeaponIcon("kiyoshi-4"),rarity: "rare", name: "Death Stinger", assChara: "Kiyoshi Kurotani" },
  { ...makeWeaponIcon("yukimi-4"),rarity: "rare", name: "Heavy Metal Pain", assChara: "Yukimi Fujikawa" },
  { ...makeWeaponIcon("seiji-4"),rarity: "rare", name: "Knight's Reward", assChara: "Seiji Shiratori" },
  { ...makeWeaponIcon("toshiya-4"),rarity: "rare", name: "Scarlet Scepter", assChara: "Toshiya Sumi" },
  { ...makeWeaponIcon("kotone-4"),rarity: "rare", name: "Edelweiss", assChara: "Kotone Montagne" },
  { ...makeWeaponIcon("miyu-4"),rarity: "rare", name: "Submarine Sonar", assChara: "Miyu Sahara" },
  { ...makeWeaponIcon("chizuko-4"),rarity: "rare", name: "Gravitational Force", assChara: "Chizuko Nagao" },

  /* 3-Star Weapons */
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Athame", assChara: "Ren Amamiya" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Electric Chakrams", assChara: "Yui" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Portable Trauma Unit", assChara: "Minami Miyashita" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Seishiki Sword", assChara: "Yusuke Kitagawa" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Flash Punch", assChara: "Makoto Nijima" },

  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "God Saber", assChara: "Morgana" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Gang Star", assChara: "Ryuji Sakamoto" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Spike Whip", assChara: "Ann Takamaki" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Willowstaff", assChara: "Yaoling Li" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Shrill Pickaxe", assChara: "Haruna Nishimori" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Break Tonfa", assChara: "Lufel" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Lightning Hammer", assChara: "Motoha Arai" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Steel Tomahawk", assChara: "Shun Kano" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Punish Lance", assChara: "Leo Kamiyama" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Sweety SG", assChara: "Kayo Tomiyama" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Sharp Twinblades", assChara: "Tomoko Noge" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Holy Nail", assChara: "Kiyoshi Kurotani" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Slashing Flail", assChara: "Yukimi Fujikawa" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Elegant Rapier", assChara: "Seiji Shiratori" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Noble Rod", assChara: "Toshiya Sumi" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Royal Saber", assChara: "Kotone Montagne" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "C.A. Explorer", assChara: "Miyu Sahara" },
  { src: "NULL", modalsrc: "NULL", collectionsrc: "NULL", rarity: "standard", name: "Cobalt Alloy Bayonet", assChara: "Chizuko Nagao" }

]

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
        const labelMatch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
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
                const isSelected = char.name === selectedCharacterName;
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
                      <span className="mt-1 text-sm capitalize">{char.name}</span>
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
