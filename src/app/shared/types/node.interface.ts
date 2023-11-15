export interface NodeInterface {
  col: number;
  row: number;
  isStart: boolean;
  isEnd: boolean;
  distance: number;
  distanceToTarget: number;
  totalCost: number;
  isVisited: boolean;
  isVisitedDirectly: boolean;
  isMaze: boolean;
  isWall: boolean;
  isPath: boolean;
  isPathDirectly: boolean;
  previousNode: NodeInterface | null;
}
