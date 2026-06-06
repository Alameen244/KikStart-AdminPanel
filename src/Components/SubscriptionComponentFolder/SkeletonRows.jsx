import { Skeleton, TableCell, TableRow } from "@mui/material";

export default function SkeletonRows({ cols }) {
  return Array.from({ length: 8 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: cols }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton variant="text" width={j === 0 ? 180 : 90} height={20} />
        </TableCell>
      ))}
    </TableRow>
  ));
}
