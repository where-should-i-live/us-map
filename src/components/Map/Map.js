import React, { Component } from "react";
import { connect } from "react-redux";
import { getCountyData, getActiveCounty } from "./../../ducks/countyReducer";
import * as d3 from "d3";
import * as topojson from "topojson-client";

class Map extends Component {
  async componentDidMount() {
    await this.props.getCountyData();
    await this.drawMap();
  }

  async drawMap() {
    const mapContext = this;
    const d3data = await fetch("https://d3js.org/us-10m.v1.json");
    const usGeoData = await d3data.json();
    const countyData = await mapContext.props.county.countyData;
    const geoPath = d3.geoPath();
    // console.log(usGeoData);
    // console.log(countyData);

    const svg = d3
      .select(".map")
      .append("svg")
      .attr("width", 960)
      .attr("height", 600);

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
      // console.log(geometries);
    }
    combineData();

    svg
      .append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(usGeoData, usGeoData.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("id", d => d.id)
      .on("click", function(d) {
        mapContext.props.getActiveCounty(d.id);
      });

    svg
      .append("path")
      .attr("class", "county-borders")
      .attr(
        "d",
        geoPath(
          topojson.mesh(usGeoData, usGeoData.objects.counties, function(a, b) {
            return a !== b;
          })
        )
      );

    svg
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

    svg
      .append("path")
      .attr("class", "nation-borders")
      .attr("d", geoPath(topojson.mesh(usGeoData, usGeoData.objects.nation)));
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
