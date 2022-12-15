import React from "react";

// Array(rows) means array with rows no of element and Arrow(rows).fill() means we will be filling
//  the array with a element that undefined in this case
//  we are using fill because we need to use map and map doesnt work with empty array.

const Generategrid = (rows, cols, mapper) => {
  return Array(rows)
    .fill()
    .map(() => {
      return Array(cols).fill().map(mapper);
    });
};
const styleCell ={
  backgroundColor:"blue",
  border:"2px solid lightblue",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  fontSize:"45px"

}

// 3. render flow.  the grid render each cell along with grid passes certain props which is used by the cell.
const Cell = ({handleClick,row,col,cell}) => {
  return (
    <>
      <div onClick={(e)=>handleClick(e,row,col)} style={styleCell}>{cell}</div>
    </>
  );
};


const checkThree =(a,b,c)=>{
  if(!a||!b||!c){return false}
  if(a== b && b == c){
    return true;
  }
}
const checkgrid =(flattenGrid)=>{
   const [nw,n,ne,w,c,e,sw,s,se] = flattenGrid;

    if(  checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, s, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)){return true}
    return false
}
const flatten =(grid)=>{
  return  grid.reduce((accumlator,currentvalue)=>{
    return [...accumlator,...currentvalue]
  },[]) 
}

const getInitialState =()=> ({
   grid : Generategrid(3, 3, () => null),
   currentStatus : "running",
   turn : "X"
})

const toggleChance ={
  X:"O",O:"X"
}

// Simple way to deeply clone an array or object 
//this is technique to deep cloning the object of object with unknow depth without
const clone = x => JSON.parse(JSON.stringify(x))

const reducer = (state,action) =>{

  switch (action.type)
      {
        case 'CLICK': {
            const {x,y} = action.payload

            // state.turn = toggleChance[state.turn]
            // we cannot do like this instead we have to return a new state object 
            // and for that first we need a copy of original state object

            const newState = clone(state);
            // console.log(newState)
            const {grid, turn} = newState
            
            if(grid[x][y]){
              console.log("direct return is enabled")
              return state;
            }
            grid[x][y] = turn;  
            // console.log(grid)
            // console.log(grid)
            // console.log(grid)
            
            //checking of the win
            // ==============================priting different values in the console """""""""""""problem"""""""""""""===============
            const flattengrid = flatten(grid);
            if(checkgrid(flattengrid)){
              newState.currentStatus = `${turn} wins`
              return newState
            }
            
            newState.turn = toggleChance[state.turn]

            return newState
        }
        case "RESET":{
              return getInitialState();

        }
        
        default:
          return state;
      }



}


// render flow  2. as grid renders a cell for each grid item along with it pass row and col copy and a handlclick funciton with it.
const Grid = ({handleClick,grid}) => {

  return (
    <>
      <div className="inline-block">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,7em)",
            gridTemplateRows: "repeat(3,7em)",
          }}
        >
          {grid.map((row, rowidx) => {
            return row.map((cellval, colidx) => {
              // console.log(cellval)
              return <Cell handleClick={handleClick} row={rowidx} col={colidx} key={rowidx - colidx} cell={cellval}/>;
            });
          })}
        </div>
      </div>
    </>
  );
};



// render flow 1. all starts with here game is rendering grid grid taking the grid using getInitialstate() of usereducer takes grid and renders grid for each cell along with grid another function is passed to the grid called handleclick.

// click flow 1. as the user click on the grid the call is a function is run called dispatch. this funciton is run by cell. 
const Game = () => {
  const [state, dispatch] = React.useReducer(reducer, getInitialState())
  const a = 1;
    const {grid} = state;
  const handleClick = (e,x,y)=>{
    dispatch({type:"CLICK",payload:{x,y}})
  }
  const handlebtnClick = ()=>{
    dispatch({type:"RESET"})
  }

  return (
    <>
          <button onClick={handlebtnClick}>reset</button>
          <div>{state.currentStatus}</div>
        <Grid grid={grid} handleClick={handleClick}/>
    </>
  );
};

export default Game;





