import { VStack, HStack, Input, Text, Box } from "@chakra-ui/react";

interface WordSectionProps {
  letters: string[];
  hint?: string;
  focusNextSection: () => void;
  focusPrevSection: () => void;
  onGuessChange: (inputIndex: number, value: string) => void;
  guesses: string[];
  refs: React.RefObject<HTMLInputElement[]>;
}

export const WordSection: React.FC<WordSectionProps> = ({
  letters,
  hint,
  focusNextSection,
  focusPrevSection,
  onGuessChange,
  guesses,
  refs,
}) => {
  // Check if all letters are filled
  const allFilled = guesses.every((guess) => guess.trim() !== "");

  // Check if all letters are correct
  const isCorrect =
    allFilled && guesses.every((guess, index) => guess === letters[index]);

  // Check if all are filled but one or more is wrong
  const isIncorrect = allFilled && !isCorrect;

  const handleInputChange = (index: number, value: string) => {
    const trimmedValue = value.slice(-1); // Only accept one character
    onGuessChange(index, trimmedValue);

    if (trimmedValue && index < letters.length - 1) {
      refs.current?.[index + 1]?.focus();
    } else if (trimmedValue && index === letters.length - 1) {
      focusNextSection();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && guesses[index] === "" && index === 0) {
      focusPrevSection();
    } else if (e.key === "Backspace" && guesses[index] === "") {
      refs.current?.[index - 1]?.focus();
    }
  };

  const sectionColor = isCorrect
    ? "green.500"
    : isIncorrect
    ? "red.500"
    : "black";

  return (
    <Box
      padding={2}
      borderRadius="md"
      border="2px solid"
      borderColor={sectionColor}
    >
      <VStack>
        <HStack gap={2}>
          {letters.map((_, index) => (
            <Input
              key={index}
              size="sm"
              width="50px"
              textAlign="center"
              maxLength={1}
              value={guesses[index]}
              ref={(el) => {
                if (refs.current && el) refs.current[index] = el;
              }}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              color={sectionColor} // Input text color changes based on status
              borderColor={sectionColor} // Input border color changes based on status
              focusRingColor={sectionColor} // Focused border color matches section status
            />
          ))}
        </HStack>
        {hint && (
          <Text fontSize="xs" color={sectionColor} textAlign={"center"}>
            {hint}
          </Text>
        )}
      </VStack>
    </Box>
  );
};
