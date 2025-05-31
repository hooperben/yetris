import { CellOptions } from "@/types";

const Cell = ({ type }: { type: CellOptions }) => {
  return <div className={`cell ${type}`} />;
};

export default Cell;
