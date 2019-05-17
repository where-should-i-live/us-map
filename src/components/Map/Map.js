import React, { Component } from "react";
import { connect } from "react-redux";
import { getCountyData, standardDeviation, getActiveCounty } from "./../../ducks/countyReducer";
import { addFavorite } from "./../../ducks/favoritesReducer";

import * as d3 from "d3";
import * as topojson from "topojson-client";

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: 'household_income_stdev',
      val: 60000
    };
  }
  async componentDidMount() {
    await this.props.getCountyData();
    await this.props.standardDeviation();
    await this.drawMap();
  }

  async drawMap() {
    const mapContext = this;
    const d3data = await fetch("https://d3js.org/us-10m.v1.json");
    const usGeoData = await d3data.json();
    const countyData = await mapContext.props.county.countyData;
    const geoPath = d3.geoPath();

    const svg = d3
      .select(".map")
      .append("svg")
      .attr("width", 960)
      .attr("height", 600);

    const combinedData = topojson.feature(usGeoData, usGeoData.objects.counties).features;


    function combineData() {
      for (let i = 0; i < combinedData.length; i++) {
        let value = countyData.find(
          county => Number(county.county_id) === Number(combinedData[i].id)
        );
        if (value) {
          combinedData[i].county_name = value.county_name;
          combinedData[i].county_state_name = value.county_state_name;
          combinedData[i].household_income = value.household_income;
          combinedData[i].property_value = value.property_value;
          combinedData[i].commute_time = value.commute_time;
          combinedData[i].median_age = value.median_age;
          combinedData[i].slug = value.slug;
        }
      }
    }
    combineData();

    svg
      .append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(combinedData)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("id", d => d.id)
      .attr("fill", function shader(d) {
        let data = mapContext.state.dataset;
        let stdev = mapContext.props.county.standardDeviation[data]
        ////logic to set color ranges////
        const { val } = mapContext.state

        const color8 = '#edfdff' 
        const color7 = '#a6f7ff'
        const color6 = '#71f3ff'
        const color5 = '#3cefff'
        const color4 = '#32c4d1'
        const color3 = '#21838c'
        const color2 = '#16575d'
        const color1 = '#0b2c2f'

        if ((val - stdev) < d.household_income && d.household_income < (val + stdev)) {
          console.log(val)
          return color1;
        } else if ((val - 2 * stdev) < d.household_income && d.household_income < (val + 2 * stdev)) {
          return color2;
        } else if ((val - 3 * stdev) < d.household_income && d.household_income < (val + 3 * stdev)) {
          return color3;
        }else if ((val - 4 * stdev) < d.household_income && d.household_income < (val + 4 * stdev)) {
          return color4;
        }else if ((val - 5 * stdev) < d.household_income && d.household_income < (val + 5 * stdev)) {
          return color5;
        }else if ((val - 6 * stdev) < d.household_income && d.household_income < (val + 6 * stdev)) {
          return color6;
        }else if ((val - 7 * stdev) < d.household_income && d.household_income < (val + 7 * stdev)) {
          return color7;
        }else if ((val - 8 * stdev) < d.household_income && d.household_income < (val + 8 * stdev)) {
          return color8;
        } else {
          return 'white'}

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
      <input onChange={(e) => this.setState({val: e.target.value})}/>
      <select className='select-dataset' onChange={e => this.setState({dataset: e.target.value})}>
        <option value={this.props.county.standardDeviation.household_income_stdev}>Household Income</option>
        <option value={this.props.county.standardDeviation.property_value_stdev}>Property Value</option>
        <option value={this.props.county.standardDeviation.commute_time_stdev}>Commute Time</option>
        <option value={this.props.county.standardDeviation.median_age_stdev}>Median Age</option>
      </select>
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
  { getCountyData, standardDeviation, getActiveCounty, addFavorite }
)(Map);
