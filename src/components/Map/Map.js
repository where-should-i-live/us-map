import React, { Component } from "react";
import { connect } from "react-redux";
import { getCountyData } from "./../../ducks/countyReducer";
import * as d3 from "d3";
import * as topojson from "topojson-client";

class Map extends Component {
  constructor() {
    super();
    this.state = {
      usGeoData: []
    };
  }

  componentDidMount() {
    this.drawMap();
  }

  drawMap() {
    console.log(this.props.county.countyData);
    const geoPath = d3.geoPath();
    const svg = d3
      .select(".map")
      .append("svg")
      .attr("width", 960)
      .attr("height", 600);

    d3.json("https://d3js.org/us-10m.v1.json").then(function(usGeoData) {
      const counties = svg
        .append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(usGeoData, usGeoData.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("id", d => d.id);

      const countyBorders = svg
        .append("path")
        .attr("class", "county-borders")
        .attr(
          "d",
          geoPath(
            topojson.mesh(usGeoData, usGeoData.objects.counties, function(
              a,
              b
            ) {
              return a !== b;
            })
          )
        );

      const stateBorders = svg
        .append("path")
        .attr("class", "state-borders")
        .attr(
          "d",
          geoPath(
            topojson.mesh(usGeoData, usGeoData.objects.states, function(a, b) {
              return a !== b;
            })
          )
        );

      const nationBorders = svg
        .append("path")
        .attr("class", "nation-borders")
        .attr("d", geoPath(topojson.mesh(usGeoData, usGeoData.objects.nation)));
    });
  }

  render() {
    return (
      <div className="map-container">
        <div className="map" />
      </div>
    );
  }
}

const mapState = reduxState => {
  return {
    user: reduxState.user,
    favorites: reduxState.favorites,
    county: reduxState.county
  };
};

export default connect(
  mapState,
  { getCountyData }
)(Map);
