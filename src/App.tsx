import React, { useState, useRef, useEffect } from "react";
import {
  ChakraProvider,
  Text,
  Flex,
  defaultSystem,
  DialogRoot,
  DialogContent,
  DialogBackdrop,
  DialogBody,
  DialogHeader,
  DialogTitle,
} from "@chakra-ui/react";

import { WordSection } from "./components/ui/WordSection";

const App: React.FC = () => {
  const sections = [
    {
      letters: ["s", "y", "k"],
      hint: "Amun om han klarer å klatre opp til pepperkakehuset",
    },
    {
      letters: ["k"],
      hint: "Passiv aggressivt svar på en lang melding",
    },
    {
      letters: ["e", "l"],
      hint: "Nikola Tesla, AC/DC, Edison, bilen til mamma og pappa",
    },
    {
      letters: ["b", "u"],
      hint: "Der ingen skulle tru at nokon kunne...",
    },
    {
      letters: ["k"],
      hint: "Helt greit alene, to er et magasin om damer og antrekk, jævlig problematisk med tre",
    },
    {
      letters: ["s", "e", "r"],
      hint: "Arkaisk honorific, kan brukes om eksempelvis David Attenborough",
    },
  ];

  const [userGuesses, setUserGuesses] = useState<string[][]>(
    sections.map((section) => new Array(section.letters.length).fill(""))
  );
  const [isCompleted, setIsCompleted] = useState(false);

  const sectionRefs = useRef<(HTMLInputElement[] | null)[]>(
    sections.map(() => Array(sections.length).fill(null))
  );

  const handleGuessChange = (
    sectionIndex: number,
    inputIndex: number,
    value: string
  ) => {
    const updatedGuesses = [...userGuesses];
    updatedGuesses[sectionIndex][inputIndex] = value;
    setUserGuesses(updatedGuesses);
  };

  const focusNextSection = (currentSectionIndex: number) => {
    if (currentSectionIndex < sections.length - 1) {
      const nextSectionFirstInput =
        sectionRefs.current[currentSectionIndex + 1]?.[0];
      nextSectionFirstInput?.focus();
    }
  };

  const focusPrevSection = (currentSectionIndex: number) => {
    if (currentSectionIndex > 0) {
      const prevSectionLastInput =
        sectionRefs.current[currentSectionIndex - 1]?.[
          sections[currentSectionIndex - 1].letters.length - 1
        ];
      prevSectionLastInput?.focus();
    }
  };

  // Check if all sections are correct
  useEffect(() => {
    const allCorrect = sections.every((section, sectionIndex) =>
      userGuesses[sectionIndex].every(
        (guess, letterIndex) => guess === section.letters[letterIndex]
      )
    );
    setIsCompleted(allCorrect);
  }, [userGuesses]);

  return (
    <ChakraProvider value={defaultSystem}>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        w="100vw"
        p={5}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Julegave rebus
        </Text>
        <Text fontSize="md" mb={5} textAlign={"center"}>
          Svaret er ett ord på ni bokstaver, seksjonene er bare for å vise hva
          som tilhører hvilket hint. Seksjonen blir grønn hvis alle bokstavene
          er rette. Spør Vegard om for ekstra hint (eller fasit).
        </Text>

        <Flex gap={4}>
          {sections.map((section, sectionIndex) => (
            <WordSection
              key={sectionIndex}
              letters={section.letters}
              hint={section.hint}
              focusNextSection={() => focusNextSection(sectionIndex)}
              focusPrevSection={() => focusPrevSection(sectionIndex)}
              guesses={userGuesses[sectionIndex]}
              onGuessChange={(inputIndex, value) =>
                handleGuessChange(sectionIndex, inputIndex, value)
              }
              refs={{
                current:
                  sectionRefs.current[sectionIndex] ||
                  (sectionRefs.current[sectionIndex] = []),
              }}
            />
          ))}
        </Flex>
      </Flex>

      <DialogRoot open={isCompleted} onOpenChange={() => {}}>
        <DialogBackdrop />
        <DialogContent py={4}>
          <DialogHeader>
            <DialogTitle fontSize={"2xl"} textAlign={"center"}>
              Gratulerer!
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text fontSize="lg" textAlign="center">
              Julegaven er sykkelbukser, kjøpt etter jul siden man får mer for
              prisen da, og jeg regner med du ikke skal på noen lange
              sykkelturer med det første.
            </Text>
            <Text fontSize="lg" textAlign="center" pt={4}>
              NB! Julegaven inkluderer også et tilbud om at Vegard organiserer
              (ordner mat, rute, pakkeliste o.l.) en tur enten på sykkel eller
              annen fremkomst på en tid som passer for begge!
            </Text>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </ChakraProvider>
  );
};

export default App;
