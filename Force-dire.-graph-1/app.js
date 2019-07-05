var width = 600;
var height = 600;

var nodes = [
  { color: "red", size: 5, },
  { color: "orange", size: 10 },
  { color: "yellow", size: 15 },
  { color: "green", size: 20 },
  { color: "blue", size: 25 },
  { color: "purple", size: 30 }
];

var links = [
  { source: "red", target: "orange"},
  { source: "orange", target: "yellow"},
  { source: "yellow", target: "green"},
  { source: "green", target: "blue"},
  { source: "blue", target: "purple"},
  { source: "purple", target: "red"},
  { source: "green", target: "red"}
];

var svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height);

var linkSelection = svg 
                      .selectAll("line")
                      .data(links)
                      .enter()
                      .append("line")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        


var nodeSelection = svg
                      .selectAll("circle")
                      .data(nodes)
                      .enter()
                      .append("circle")
                        .attr("r", d => d.size)
                        .attr("fill", d => d.color)
                        .call(d3.drag()   
                                .on("start",dragStart)
                                .on("drag",drag)
                                .on("end",dragEnd));


             // force simulation is added the properties or keys of vx, vy x, y  inside of nodes array.
//=============  vx and vy  records the velocity of the node as per forces acting on it 
//=============  x and y records the position of the node with respect to noodes current position and its velocity
           



var simulation = d3.forceSimulation(nodes);        // nodes -ARRAY       


// d3.forceCenter([x,y]) force location (coordinates where u like the force to pull the nodes).
// By default pull nodes to 0,0.

// d3.forceLink([links_array]) used to add links to nodes or update the link later using .links



simulation
  .force("center", d3.forceCenter(width / 2, height / 2))  // .force(forceType,callback Fun to describe forceType proerties)
  .force("nodes", d3.forceManyBody())                      // applying the forces in between nodes by-default -30(repulsive)
  .force("links", d3.forceLink(links)
                    .id(d => d.color)                      // connecting the links with nodes on the basis of colors 
                    .distance(d => 5 * ( d.source.size + d.target.size )))   // all node moves apart to distance of 300
  .on('tick', ticked);
         



function ticked() {
  nodeSelection
    .attr("cx", d => d.x )
    .attr("cy", d => d.y );


  linkSelection
    .attr("x1", d => d.source.x)          //Setting the initial and final cordinates for lines  
    .attr("y1", d => d.source.y)          //to create visible links. d3.select("line").data() gives 
    .attr("x2", d => d.target.x)           //the array of objects and having property source,color,vx,vy,x,y,target
    .attr("y2", d => d.target.y)
}



function dragStart(d){                // initial position of nodes before dragging
  simulation.alphaTarget(0.5).restart();    // setting up the alpha values
  d.fx=d.x;
  d.fy=d.y;
}



function drag(d){                    // final position of dragging which is mouse postion
  d.fx=d3.event.x;
  d.fy=d3.event.y;
}



function dragEnd(d){                // once we set the final position these vslues aree getting fixed.
  simulation.alphaTarget(0);
  d.fx=null;                      // In order to prevent the permanent fixed of taht value we have change the 
  d.fy=null;                      // fx and fy values to null
}
