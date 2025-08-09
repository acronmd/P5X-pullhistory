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
  rarity: "none" | "common" | "rare" | "superrare";
  name: string;
  codename: string;
  affinity: "Cleave" | "Fire" | "Ice" | "Elec" | "Wind" | "Psi" | "Nuclear" | "Bless" | "Curse" | "Support";
};

export type WeaponData = {
  src: string;
  modalsrc: string;
  rarity: "none" | "standard" | "rare" | "superrare";
  name: string;
  assChara: string;
}

function makeIcon(ch: string, modalFolder = "chicons") {
  return {
    src: new URL(`./assets/chicons/${ch}.png`, import.meta.url).href,
    modalsrc: new URL(`./assets/chicons/modal/${ch}.png`, import.meta.url).href
  };
}

function makePersonaIcon(ch: string, modalFolder = "persicons") {
  return {
    src: new URL(`./assets/persicons/${ch}.png`, import.meta.url).href,
    modalsrc: new URL(`./assets/${modalFolder}/${ch}.png`, import.meta.url).href
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const availableCharacters: CharacterData[] = [
  { ...makeIcon("ren"), rarity: "superrare", name: "Ren Amamiya", codename: "Joker", affinity: "Curse" },
  { ...makeIcon("yui"), rarity: "superrare", name: "Yui", codename: "Bui", affinity: "Elec" },
  { ...makeIcon("minami"), rarity: "superrare", name: "Minami Miyashita", codename: "Marian", affinity: "Bless" },
  { ...makeIcon("yusuke"), rarity: "superrare", name: "Yusuke Kitagawa", codename: "Fox", affinity: "Ice" },
  { ...makeIcon("makoto"), rarity: "superrare", name: "Makoto Nijima", codename: "Queen", affinity: "Nuclear" },
  { ...makeIcon("morgana"), rarity: "superrare", name: "Morgana", codename: "Mona", affinity: "Wind" },
  { ...makeIcon("ryuji"), rarity: "superrare", name: "Ryuji Sakamoto", codename: "Skull", affinity: "Cleave" },
  { ...makeIcon("ann"), rarity: "superrare", name: "Ann Takamaki", codename: "Panther", affinity: "Fire" },
  { ...makeIcon("yaoling"), rarity: "superrare", name: "Yaoling Li", codename: "Rin", affinity: "Curse" },
  { ...makeIcon("haruna"), rarity: "superrare", name: "Haruna Nishimori", codename: "Riddle", affinity: "Psi" },

  { src: "./src/assets/chicons/lufel.png", modalsrc: "./src/assets/chicons/modal/lufel.png", rarity: "rare", name: "Lufel", codename: "Cattle", affinity: "Fire" },
  { src: "./src/assets/chicons/motoha.png", modalsrc: "./src/assets/chicons/modal/motoha.png", rarity: "rare", name: "Motoha Arai", codename: "Closer", affinity: "Elec" },
  { src: "./src/assets/chicons/shun.png", modalsrc: "./src/assets/chicons/modal/shun.png", rarity: "rare", name: "Shun Kano", codename: "Soy", affinity: "Ice" },
  { src: "./src/assets/chicons/leo.png", modalsrc: "./src/assets/chicons/modal/leo.png", rarity: "rare", name: "Leo Kamiyama", codename: "Leon", affinity: "Nuclear" },
  { src: "./src/assets/chicons/kayo.png", modalsrc: "./src/assets/chicons/modal/kayo.png", rarity: "rare", name: "Kayo Tomiyama", codename: "Okyaan", affinity: "Support" },
  { src: "./src/assets/chicons/Tomoko.png", modalsrc: "./src/assets/chicons/modal/tomoko.png", rarity: "rare", name: "Tomoko Noge", codename: "Moko", affinity: "Psi" },
  { src: "./src/assets/chicons/kiyoshi.png", modalsrc: "./src/assets/chicons/modal/kiyoshi.png", rarity: "rare", name: "Kiyoshi Kurotani", codename: "Key", affinity: "Fire" },
  { src: "./src/assets/chicons/yukimi.png", modalsrc: "./src/assets/chicons/modal/yukimi.png", rarity: "rare", name: "Yukimi Fujikawa", codename: "Yuki", affinity: "Bless" },
  { src: "./src/assets/chicons/seiji.png", modalsrc: "./src/assets/chicons/modal/seiji.png", rarity: "rare", name: "Seiji Shiratori", codename: "Fleuret", affinity: "Wind" },
  { src: "./src/assets/chicons/toshiya.png", modalsrc: "./src/assets/chicons/modal/toshiya.png", rarity: "rare", name: "Toshiya Sumi", codename: "Sepia", affinity: "Curse" },
  { src: "./src/assets/chicons/kotone.png", modalsrc: "./src/assets/chicons/modal/kotone.png", rarity: "rare", name: "Kotone Montagne", codename: "Mont", affinity: "Ice" },
  { src: "./src/assets/chicons/miyu.png", modalsrc: "./src/assets/chicons/modal/miyu.png", rarity: "rare", name: "Miyu Sahara", codename: "Puppet", affinity: "Support" },
  { src: "./src/assets/chicons/chizuko.png", modalsrc: "./src/assets/chicons/modal/chizuko.png", rarity: "rare", name: "Chizuko Nagao", codename: "Vino", affinity: "Nuclear" },

  /* Cleave */
  { src: "./src/assets/persicons/inugami.png", modalsrc: "./src/assets/persicons/modal/inugami.png", rarity: "common", name: "Inugami", codename: "N/A", affinity: "Cleave" },
  { src: "./src/assets/persicons/ippon_datara.png", modalsrc: "./src/assets/persicons/modal/ippon_datara.png", rarity: "common", name: "Ippon-Datara", codename: "N/A", affinity: "Cleave" },
  { src: "./src/assets/persicons/mandrake.png", modalsrc: "./src/assets/persicons/modal/mandrake.png", rarity: "common", name: "Mandrake", codename: "N/A", affinity: "Cleave" },
  { src: "./src/assets/persicons/mokoi.png", modalsrc: "./src/assets/persicons/modal/mokoi.png", rarity: "common", name: "Mokoi", codename: "N/A", affinity: "Cleave" },

  /* Fire */
  { src: "./src/assets/persicons/hua_po.png", modalsrc: "./src/assets/persicons/modal/hua_po.png", rarity: "common", name: "Hua Po", codename: "N/A", affinity: "Fire"  },
  { src: "./src/assets/persicons/orobas.png", modalsrc: "./src/assets/persicons/modal/orobas.png", rarity: "common", name: "Orobas", codename: "N/A", affinity: "Fire"  },
  { src: "./src/assets/persicons/pyrojack.png", modalsrc: "./src/assets/persicons/modal/pyrojack.png", rarity: "common", name: "Jack-o'-Lantern", codename: "N/A", affinity: "Fire"  },

  /* Ice */
  { src: "./src/assets/persicons/andras.png", modalsrc: "./src/assets/persicons/modal/andras.png", rarity: "common", name: "Andras", codename: "N/A", affinity: "Ice"  },
  { src: "./src/assets/persicons/apsaras.png", modalsrc: "./src/assets/persicons/modal/apsaras.png", rarity: "common", name: "Apsaras", codename: "N/A", affinity: "Ice"  },
  { src: "./src/assets/persicons/koropokguru.png", modalsrc: "./src/assets/persicons/modal/koropokguru.png", rarity: "common", name: "Koropokguru", codename: "N/A", affinity: "Ice"  },
  { src: "./src/assets/persicons/kushimitama.png", modalsrc: "./src/assets/persicons/modal/kushimitama.png", rarity: "common", name: "Kushi Mitama", codename: "N/A", affinity: "Ice"  },
  { src: "./src/assets/persicons/saki_mitama.png", modalsrc: "./src/assets/persicons/modal/saki_mitama.png", rarity: "common", name: "Saki Mitama", codename: "N/A", affinity: "Ice"  },

  /* Elec */
  { src: "./src/assets/persicons/agathion.png", modalsrc: "./src/assets/persicons/modal/agathion.png", rarity: "common", name: "Agathion", codename: "N/A", affinity: "Elec"  },
  { src: "./src/assets/persicons/pixie.png", modalsrc: "./src/assets/persicons/modal/pixie.png", rarity: "common", name: "Pixie", codename: "N/A", affinity: "Elec"  },
  { src: "./src/assets/persicons/shiisa.png", modalsrc: "./src/assets/persicons/modal/shiisa.png", rarity: "common", name: "Shiisa", codename: "N/A", affinity: "Elec"  },

  /* Wind */
  { src: "./src/assets/persicons/bicorn.png", modalsrc: "./src/assets/persicons/modal/bicorn.png", rarity: "common", name: "Bicorn", codename: "N/A", affinity: "Wind" },
  { src: "./src/assets/persicons/highpixie.png", modalsrc: "./src/assets/persicons/modal/highpixie.png", rarity: "common", name: "High Pixie", codename: "N/A", affinity: "Wind" },
  { src: "./src/assets/persicons/kelpie.png", modalsrc: "./src/assets/persicons/modal/kelpie.png", rarity: "common", name: "Kelpie", codename: "N/A", affinity: "Wind" },
  { src: "./src/assets/persicons/kodama.png", modalsrc: "./src/assets/persicons/modal/kodama.png", rarity: "common", name: "Kodama", codename: "N/A", affinity: "Wind" },
  { src: "./src/assets/persicons/koppa_tengu.png", modalsrc: "./src/assets/persicons/modal/koppa_tengu.png", rarity: "common", name: "Koppa Tengu", codename: "N/A", affinity: "Wind" },
  { src: "./src/assets/persicons/nekomata.png", modalsrc: "./src/assets/persicons/modal/nekomata.png", rarity: "common", name: "Nekomata", codename: "N/A", affinity: "Wind" },
  { src: "./src/assets/persicons/sudama.png", modalsrc: "./src/assets/persicons/modal/sudama.png", rarity: "common", name: "Sudama", codename: "N/A", affinity: "Wind" },

  /* Psi */

  /* Nuclear */
  { src: "./src/assets/persicons/makami.png", modalsrc: "./src/assets/persicons/modal/makami.png", rarity: "common", name: "Makami", codename: "N/A", affinity: "Nuclear" },
  { src: "./src/assets/persicons/suzaku.png", modalsrc: "./src/assets/persicons/modal/suzaku.png", rarity: "common", name: "Suzaku", codename: "N/A", affinity: "Nuclear" },

  /* Bless */
  { src: "./src/assets/persicons/nigimitama.png", modalsrc: "./src/assets/persicons/modal/nigimitama.png", rarity: "common", name: "Nigi Mitama", codename: "N/A", affinity: "Bless" },

  /* Curse */
  { src: "./src/assets/persicons/onmoraki.png", modalsrc: "./src/assets/persicons/modal/onmoraki.png", rarity: "common", name: "Onmoraki", codename: "N/A", affinity: "Curse" },
  { src: "./src/assets/persicons/slime.png", modalsrc: "./src/assets/persicons/modal/slime.png", rarity: "common", name: "Slime", codename: "N/A", affinity: "Curse" },

  // Add more characters here as needed
  { src: "./src/assets/chicons/basic.png", modalsrc: "./src/assets/persicons/modal/basic.png", rarity: "none", name: "Clear", codename: "N/A", affinity: "Support" },
];

export const availableWeapons: WeaponData[] = [
  /* 5-Star Weapons */
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Phoenix Dagger", assChara: "Ren Amamiya" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Cyber Jammers", assChara: "Yui" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Angel Heart", assChara: "Minami Miyashita" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Shadowkiller", assChara: "Yusuke Kitagawa" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Nuclear Finisher", assChara: "Makoto Nijima" },

  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Golden Legacy", assChara: "Morgana" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Revenge Axe", assChara: "Ryuji Sakamoto" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Rosethorn", assChara: "Ann Takamaki" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Infinite Moment", assChara: "Yaoling Li" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Sweet Pickaxe", assChara: "Haruna Nishimori" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Fallen Angel Wing", assChara: "Lufel" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Quasar", assChara: "Motoha Arai" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Permafrost", assChara: "Shun Kano" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Final Buster", assChara: "Leo Kamiyama" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Retro Disco Style", assChara: "Kayo Tomiyama" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Dream and Nightmare", assChara: "Tomoko Noge" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Baptism by Fire", assChara: "Kiyoshi Kurotani" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Karmic Cycle", assChara: "Yukimi Fujikawa" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Venus Sunrise", assChara: "Seiji Shiratori" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Babel's Verdict", assChara: "Toshiya Sumi" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Queen of Winter", assChara: "Kotone Montagne" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Ephemerality", assChara: "Miyu Sahara" },
  { src: "NULL", modalsrc: "NULL", rarity: "superrare", name: "Jolting Pulse", assChara: "Chizuko Nagao" },

  /* 4-Star Weapons */
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Machete", assChara: "Ren Amamiya" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Meta Directors", assChara: "Yui" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Hymn of Life", assChara: "Minami Miyashita" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Jagato", assChara: "Yusuke Kitagawa" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Omega Knuckle", assChara: "Makoto Nijima" },

  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Shamshir", assChara: "Morgana" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Grand Presser", assChara: "Ryuji Sakamoto" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Masquerade Ribbon", assChara: "Ann Takamaki" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Sunstaff", assChara: "Yaoling Li" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Chirpy Pickaxe", assChara: "Haruna Nishimori" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Lava Flame", assChara: "Lufel" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Crime and Punishment", assChara: "Motoha Arai" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Demon's Bite", assChara: "Shun Kano" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Justice Lance", assChara: "Leo Kamiyama" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Emerald Charmer", assChara: "Kayo Tomiyama" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Shadow Crowns", assChara: "Tomoko Noge" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Death Stinger", assChara: "Kiyoshi Kurotani" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Heavy Metal Pain", assChara: "Yukimi Fujikawa" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Knight's Reward", assChara: "Seiji Shiratori" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Scarlet Scepter", assChara: "Toshiya Sumi" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Edelweiss", assChara: "Kotone Montagne" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Submarine Sonar", assChara: "Miyu Sahara" },
  { src: "NULL", modalsrc: "NULL", rarity: "rare", name: "Gravitational Force", assChara: "Chizuko Nagao" },

  /* 3-Star Weapons */
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Athame", assChara: "Ren Amamiya" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Electric Chakrams", assChara: "Yui" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Portable Trauma Unit", assChara: "Minami Miyashita" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Seishiki Sword", assChara: "Yusuke Kitagawa" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Flash Punch", assChara: "Makoto Nijima" },

  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "God Saber", assChara: "Morgana" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Gang Star", assChara: "Ryuji Sakamoto" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Spike Whip", assChara: "Ann Takamaki" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Willowstaff", assChara: "Yaoling Li" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Shrill Pickaxe", assChara: "Haruna Nishimori" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Break Tonfa", assChara: "Lufel" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Lightning Hammer", assChara: "Motoha Arai" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Steel Tomahawk", assChara: "Shun Kano" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Punish Lance", assChara: "Leo Kamiyama" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Sweety SG", assChara: "Kayo Tomiyama" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Sharp Twinblades", assChara: "Tomoko Noge" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Holy Nail", assChara: "Kiyoshi Kurotani" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Slashing Flail", assChara: "Yukimi Fujikawa" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Elegant Rapier", assChara: "Seiji Shiratori" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Noble Rod", assChara: "Toshiya Sumi" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Royal Saber", assChara: "Kotone Montagne" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "C.A. Explorer", assChara: "Miyu Sahara" },
  { src: "NULL", modalsrc: "NULL", rarity: "standard", name: "Cobalt Alloy Bayonet", assChara: "Chizuko Nagao" }

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
