# PathfindingVisualizer

This is an application for visualizing the popular search algorithms: Dijkstra's, A\* and Depth-First while finding the most optimum path between two nodes: Start and Target, or while generating a perfect Maze.

### Why I choosed to build this application?

I followed the principle: My app has more animations than yours!
And I thought it would be a cool dynamic visualization.

Also it was a great exercise to challange and improve my algorithmic skills while also having fun.

## How to run the application:

1. **Clone the repository.**
2. Open the terminal and run the following commands:
   ```bash
   npm install
   npm start
   ```
3. Open the browser at http://localhost:4200

## How to play with the app:

1. First you have to choose an algorithm from the header dropdown: Select Algo .

2. You can draw walls on the board by holding the mouse left click and moving it around the board.

3. Then you can click the Watch button from the middle of the header to start visualizing the algorithm.

## Features

1. Change the speed of the search visualizing from the header -> Change Speed dropdown.

2. Change the search algorithm from the header from the header -> Select Algo dropdown.

3. Generate a randomized perfect maze from the header -> Create Maze button.

4. Move the start or target nodes on the board with drag and drop, and watch immediately the algorithm search.

5. Draw walls on the board by holding the mouse left click and moving it around the board.

6. Clear the board from the header.

7. Responsiveness.

## Algorithms: How does it work?

- Dijkstra's:
  Is an algorithm for finding the shortest paths between nodes.

  1. Mark all nodes unvisited, and keep track of them with a Set.
  2. Assign to every node a distance of Infinity, and set it zero for
     the starting node.
  3. We loop through the unvisited nodes Set and get the closest one
     which initially is our starting node with a distance of zero, this will be our current node.
  4. Get all unvisited neighbours of the current node and calculate
     their distance through the current node and set the current node as their parrent node.
  5. Mark the current node as visited, and remove it from the set.
  6. Repeat until finding the end Node.

- A\*:
  Is an informed search algorithm.

  Starting from a specific starting node of the grid, it aims to find a path to the given goal node having the smallest cost (least distance travelled, shortest time).

  What is different and in addition to the Dijkstra's algo is that:
  At each iteration of its main loop, A\* determine which node to pick next, by summing two variables and taking the node with the lowest totalCost:

  - 'distance' (the distance it takes to get to that node, from the starting point, following the path generated to get there)
  - 'distanceToTarget' (the heuristic, which is the estimation of the distance from that node to the finish one).
  - 'totalCost' = distance + distanceToTarget.

  It does so until it finds the end node.

- Randomized Depth First:
  Depth-first is an algorithm for traversing or searching tree or graph data structures.

  0. Mark all nodes as walls and create a stack to keep track of the visited nodes.
  1. Choose the start node, mark it as visited and push it to the stack
  2. While the stack is not empty

  - 2.1 Pop a node from the stack and make it the current node
  - 2.2 If the current node has any neighbour which have not been visited
    - 2.2.1 Push the current node to the stack
    - 2.2.2 Choose one of the unvisited neighbours
    - 2.2.3 Remove the wall for the current and chosen nodes and between them
    - 2.2.4 Mark the chosen node as visited and push it to the stack
