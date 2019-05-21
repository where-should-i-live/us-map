function getData() {
  let numItems = 20 + Math.floor(20 * Math.random());
  let data = [];
  for (let i = 0; i < numItems; i++) {
    data.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random(),
      colour: i % 5
    });
  }
  return data;
}

let colours = ["#2176ae", "#57b8ff", "#b66d0d", "#fbb13c", "#fe6847"];

class Circles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: getData()
    };

    this.handleClick = this.handleClick.bind(this);
    this.updateStyleAndAttrs = this.updateStyleAndAttrs.bind(this);
  }

  handleClick() {
    this.setState({
      data: getData()
    });
  }

  componentDidMount() {
    this.updateStyleAndAttrs();
  }

  componentDidUpdate() {
    this.updateStyleAndAttrs();
  }

  updateStyleAndAttrs() {
    let maxRadius = 40;
    let xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, this.props.width]);
    let yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, this.props.height]);
    let rScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, maxRadius]);

    d3.select(this.svgEl)
      .selectAll("circle")
      .data(this.state.data)
      .transition()
      .duration(1000)
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", d => rScale(d.r))
      .style("fill", d => colours[d.colour]);
  }

  render() {
    let points = this.state.data.map(d => (
      <circle
        cx={0.5 * this.props.width}
        cy={0.5 * this.props.height}
        style={{ fill: "white" }}
      />
    ));

    return (
      <div>
        <svg
          width={this.props.width}
          height={this.props.height}
          ref={el => (this.svgEl = el)}
        >
          {points}
        </svg>
        <div>
          <button onClick={this.handleClick}>Update</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Circles numCircles={100} width={800} height={600} />,
  document.getElementById("app")
);
