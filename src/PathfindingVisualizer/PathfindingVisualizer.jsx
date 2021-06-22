import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder, DFS, BFS} from '../algorithms/algorithms';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import './PathfindingVisualizer.css';
import Select from '@material-ui/core/Select';

//Total number of rows and cols of the grid
let rows = 20;
let cols = 50;

//Default positions for the start and end node 
let start = [10,10];
let end = [10, 40];


export default class PathfindingVisualizer extends Component {

  constructor() {
    super();
    this.state = {
      grid: [],
      algoValue: "Dijkstra",
      wallValue: "None",
      start: start,
      end: end,
      mouseIsPressed: false,
      movingStart: false,
      movingEnd: false,
      visualized: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const {grid, start, end, visualized} = this.state;
    if(visualized) return;
    if(start && end){
      if(row === start[0] && col === start[1]){
        this.setState({movingStart: true});
      }
      else if(row === end[0] && col === end[1]){
        this.setState({movingEnd: true});
      }
      else{
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
      }
      this.setState({grid:grid, mouseIsPressed: true});
    }
  }

  handleMouseEnter(row, col) {
    const {
      start,
      end, 
      mouseIsPressed,
      movingStart,
      movingEnd,
      visualized,
    } = this.state;
    if (!mouseIsPressed || visualized) return;
    if(start && end){
      if(movingStart){
        toggleStart(this.state.grid, row, col);
        toggleStart(this.state.grid, start[0], start[1]);
        this.setState({start: [row, col], movingStart: true});
      }
      else if(movingEnd){
        toggleEnd(this.state.grid, row, col);
        toggleEnd(this.state.grid, end[0], end[1]);
        this.setState({end: [row, col], movingEnd: true});
      }
      else{
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
      }
    }
  }

  handleMouseUp() {
    const {visualized} = this.state;
    if(visualized) return;
    this.setState({mouseIsPressed: false, movingStart: false, movingEnd: false});
  }
  
  clearBoard(){
    const { visualized } = this.state;
    if (visualized) {
      return;
    }
    this.unvisitedNodes(
      true,
      start,
      end
    );
    this.setState({
      start: start,
      end: end,
    });
  }

  resetBoard(){
    const { visualized } = this.state;
    if (visualized) {
      return;
    }
    this.unvisitedNodes(
      false,
      start,
      end
    );
    this.setState({
      start: start,
      end: end,
    });
  }

  unvisitedNodes(removeWalls, startNode, endNode){
    const { grid } = this.state;
    for(let row = 0; row < rows; row++){
      for(let col = 0; col < cols; col++){
        let node = grid[row][col];
        if(node){
          const nodes = document.getElementById(`node-${node.row}-${node.col}`);
          if(nodes){
            nodes.className = "node";
          }
          node.isVisited = false;
          node.previous = null;
          node.distance = Infinity;
          if(removeWalls){
            node.isWall = false;
          }
          else if(node.isWall){
            const node_wall = document.getElementById(`node-${node.row}-${node.col}`);
            if(node_wall){
              node_wall.className = "node node-wall";
            }
          }
          if(row === startNode[0] && col === startNode[1]){
            const node_start = document.getElementById(`node-${startNode[0]}-${startNode[1]}`);
            if(node_start){
              node_start.className = "node node-start";
            }
            node.isStart = true;
          }
          if(row === endNode[0] && col === endNode[1]){
            const node_end = document.getElementById(`node-${endNode[0]}-${endNode[1]}`);
            if(node_end){
              node_end.className = "node node-finish";
            }
            node.isFinish = true;
          }
        }
      }
    }
    this.setState({grid: grid, visualized: false});
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 5 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 35 * i);
    }
  }

  algorithmChange = (e) =>{
    if(e.target && e.target.value){
      this.clearBoard();
      this.setState({algoValue: e.target.value});
    }
  };

  randomWall(){
    const { grid } = this.state;
        for(let row = 0; row < rows; row++){
          for(let col = 0; col < cols; col++){
            if((Math.random() <= 0.1 || Math.random() >= 0.85) && !grid[row][col].isStart && !grid[row][col].isFinish){
              getNewGridWithWallToggled(grid, row, col);
            }
          }
        }
        this.setState({grid:grid});
  }

  visualize(text) {
    const{ grid, start, end } = this.state;
    if(grid && start && end){
      this.unvisitedNodes(false, start, end);
      let startNode = grid[start[0]][start[1]];
      let finishNode = grid[end[0]][end[1]];
      if(startNode.isWall){
        startNode.isWall = !startNode.isWall;
      }
      if(finishNode.isWall){
        finishNode.isWall = !finishNode.isWall;
      }
      switch(text){
        case "Dijkstra":
          let visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
          let nodesInShortestPathOrder = getNodesInShortestPathOrder(startNode, finishNode);
          this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
          break;

        case "DFS":
          let visitedNodesInOrder_DFS = DFS(grid, startNode, finishNode);
          let nodesInShortestPathOrder_DFS = getNodesInShortestPathOrder(startNode, finishNode);
          this.animate(visitedNodesInOrder_DFS, nodesInShortestPathOrder_DFS);
          break;

        case "BFS":
          let visitedNodesInOrder_BFS = BFS(grid, startNode, finishNode);
          let nodesInShortestPathOrder_BFS = getNodesInShortestPathOrder(startNode, finishNode);
          this.animate(visitedNodesInOrder_BFS, nodesInShortestPathOrder_BFS);
          break;

        default: 
          return;
      }
    }
  }
  
  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <div class = "background">
        <React.Fragment>
        <CssBaseline />
        <AppBar>
          <Toolbar style = {{backgroundColor: "grey"}}>
            <Typography variant="h5" title = "Click to visit the home screen">Pathfinding Visualizer</Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              native
              label="Algorithm"
              onChange = {this.algorithmChange}
              value = {this.state.algoValue}
              style = {{backgroundColor:"white"}}
              title = "Select the algorithm to view how it works"
            >
              <option value="Dijkstra">Dijkstra</option>
              <option value="A* algorithm">A* algorithm</option>
              <option value="BFS">BFS</option>
              <option value="DFS">DFS</option>
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button title = "Visualizes the selected algorithm" variant="contained" style={{backgroundColor: "#21b6ae"}} onClick = {() => this.visualize(this.state.algoValue)}>
              Visualize 
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button title = "Clears the grid to default" variant="contained"  color="secondary" onClick = {() => this.clearBoard()} >
              Clear All
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button title = "Randomly places walls" variant="contained"  style = {{backgroundColor: "#FFFF00"}} onClick = {() => this.randomWall()} >
              Random Walls
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button title = "Resets the grid to default and keeps walls" variant="contained"  color="primary" onClick = {() => this.resetBoard()} >
              Reset Nodes
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar id="back-to-top-anchor" />
        </React.Fragment>
        <h1></h1>
        <div className = "Wrapper">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className = "rowWrapper">
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}


const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === start[0] && col === start[1],
    isFinish: row === end[0] && col === end[1],
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const toggleStart = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const toggleEnd = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: !node.isFinish,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

