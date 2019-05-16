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


    const allDataConcat = topojson.feature(usGeoData, usGeoData.objects.counties).features
    console.log(allDataConcat)

    function combineData() {
      for (let i = 0; i < allDataConcat.length; i++) {
        let value = countyData.find(
          county => Number(county.county_id) === Number(allDataConcat[i].id)
        );
        if (value) {
          allDataConcat[i].county_name = value.county_name;
          allDataConcat[i].county_state_name = value.county_state_name;
          allDataConcat[i].household_income = value.household_income;
          allDataConcat[i].property_value = value.property_value;
          allDataConcat[i].commute_time = value.commute_time;
          allDataConcat[i].median_age = value.median_age;
          allDataConcat[i].slug = value.slug;
        }
      }
    }
    combineData();
    // console.log(combineData());

    // console.log(usGeoData)
    // console.log(topojson.feature(usGeoData, usGeoData.objects.counties).features)


    // console.log(usGeoData.objects.counties.geometries)
    // console.log(topojson.feature(usGeoData, usGeoData.objects.counties).features)
    console.log(allDataConcat)

    svg
      .append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(allDataConcat)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("id", d => d.id)
      .attr("fill", function shader(d ) {
        // console.log(d)
        // shades = [1, 2, 3];

        // return value
      })
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
