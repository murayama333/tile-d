import TileOne from "./tiles/TileOne";
import TileTwo from "./tiles/TileTwo";
import TileThree from "./tiles/TileThree";
import TileFour from "./tiles/TileFour";

type Props = {
  htmlOne: string;
  htmlTwo: string;
  htmlThree: string;
  htmlFour: string;
  openTwo: boolean;
  openThree: boolean;
  openFour: boolean;
  onToggleTwo: () => void;
  onToggleThree: () => void;
};

export default function Tiles({
  htmlOne,
  htmlTwo,
  htmlThree,
  htmlFour,
  openTwo,
  openThree,
  openFour,
  onToggleTwo,
  onToggleThree,
}: Props) {
  return (
    <>
      <TileOne html={htmlOne} />
      <TileTwo html={htmlTwo} open={openTwo} onToggleSize={onToggleTwo} />
      <TileThree html={htmlThree} open={openThree} onToggleSize={onToggleThree} />
      <TileFour html={htmlFour} open={openFour} />
    </>
  );
}

