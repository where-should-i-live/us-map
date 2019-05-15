import React, { Component } from "react";
import { connect } from "react-redux";
import { getCountyData, getActiveCounty } from "./../../ducks/countyReducer";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import axios from "axios";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.drawMap();
  };

  drawMap() {
    const geoPath = d3.geoPath();
    const svg = d3
      .select(".map")
      .append("svg")
      .attr("width", 960)
      .attr("height", 600);

    d3.json("https://d3js.org/us-10m.v1.json").then(async function(usGeoData) {
      const countyData = await axios.get("/data").then(res => res.data);

      function combineData() {
        const { geometries } = usGeoData.objects.counties;
        for (let i = 0; i < geometries.length; i++) {
          let value = countyData.find(
            county => Number(county.county_id) === Number(geometries[i].id)
          );
          if (value) {
            geometries[i].county_name = value.county_name;
            geometries[i].county_state_name = value.county_state_name;
            geometries[i].household_income = value.household_income;
            geometries[i].property_value = value.property_value;
            geometries[i].commute_time = value.commute_time;
            geometries[i].median_age = value.median_age;
            geometries[i].slug = value.slug;
          }
        }
        console.log(geometries);
      }
      combineData();

      const counties = svg
        .append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(usGeoData, usGeoData.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("id", d => d.id)
        .on("click", function(d) {
          this.props.getActiveCounty(d.id);
          console.log(d.id)
        });

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
  { getCountyData, getActiveCounty }
)(Map);
