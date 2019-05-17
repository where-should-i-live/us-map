import React, { Component } from "react";
import { connect } from "react-redux";
import ActiveCounty from './ActiveCounty';
import { getCountyData, standardDeviation, getActiveCounty } from "./../ducks/countyReducer";
import { addFavorite } from "./../ducks/favoritesReducer";

import * as d3 from "d3";
import * as topojson from "topojson-client";

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: 'household_income_stdev',
      hi: true,
        hi_val: 60000,
      pv: true,
        pv_val: 217600,
      age: true,
        age_val: 38,
      c: true,
        c_val: 23  
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
      .select(".map-container")
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
      .attr("class", "g--counties")
      .selectAll("path")
      .data(combinedData)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("id", d => d.id)
      .attr("fill", function shader(d) {
        const { hi, hi_val, pv, pv_val, age, age_val, c, c_val } = mapContext.state
        const {household_income_stdev, property_value_stdev, median_age_stdev, commute_time_stdev} = mapContext.props.county.standardDeviation;

        const color8 = '#edfdff' 
        const color7 = '#a6f7ff'
        const color6 = '#71f3ff'
        const color5 = '#3cefff'
        const color4 = '#32c4d1'
        const color3 = '#21838c'
        const color2 = '#16575d'
        const color1 = '#0b2c2f'

        let datasetArr = [{datatype: 'household_income', input: Number(hi_val), sd: Number(household_income_stdev), include: hi}, {datatype: 'property_value', input: Number(pv_val), sd: Number(property_value_stdev), include: pv}, {datatype: 'median_age', input: Number(age_val), sd: Number(median_age_stdev), include: age}, {datatype: 'commute_time', input: Number(c_val), sd: Number(commute_time_stdev), include: c}];
        
        let weightArr = [];
        let weight;

        function calcWeight() {
          for (let i = 0; i < datasetArr.length; i++) {
            let {input, sd, datatype, include} = datasetArr[i];
            let datapoint = Number(d[datatype]);

            if(include) {
        
              if ((input - sd) < datapoint && datapoint < (input + sd)) {
                weightArr.push(1);
              } else if ((input - 2 * sd) < datapoint && datapoint < (input + 2 * sd)) {
                weightArr.push(2);
              } else if ((input - 3 * sd) < datapoint && datapoint < (input + 3 * sd)) {
                weightArr.push(3);
              }else if ((input - 4 * sd) < datapoint && datapoint < (input + 4 * sd)) {
                weightArr.push(4);
              }else if ((input - 5 * sd) < datapoint && datapoint < (input + 5 * sd)) {
                weightArr.push(5);
              }else if ((input - 6 * sd) < datapoint && datapoint < (input + 6 * sd)) {
                weightArr.push(6);
              }else if ((input - 7 * sd) < datapoint && datapoint < (input + 7 * sd)) {
                weightArr.push(7);
              }else if ((input - 8 * sd) < datapoint && datapoint < (input + 8 * sd)) {
                weightArr.push(8);
              } else {
                weightArr.push(9); 
              }
            }
          }
          return weight = Number(weightArr.reduce((total, current) => total + current, 0))/weightArr.length;
        }
        calcWeight();

        if (weight < 2) {
          return color1;
        } else if (weight < 3) {
          return color2;
        } else if (weight < 4) {
          return color3;
        }else if (weight < 5) {
          return color4;
        }else if (weight < 6) {
          return color5;
        }else if (weight < 7) {
          return color6;
        }else if (weight < 8) {
          return color7;
        }else if (weight < 9) {
          return color8;
        } else {
          return 'white'}

      })
      .on("click", function(d) {
        mapContext.props.getActiveCounty(d.id);
      });

    svg
      .append("path")
      .attr("class", "path__borders--county")
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
      .attr("class", "path__borders--state")
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
      .attr("class", "path__borders--nation")
      .attr("d", geoPath(topojson.mesh(usGeoData, usGeoData.objects.nation)));
  }

  render() {
    return (
      <div className="map">
      <input onChange={(e) => this.setState({val: e.target.value})}/>
      <select className='select-dataset' onChange={e => this.setState({dataset: e.target.value})}>
        <option value={this.props.county.standardDeviation.household_income_stdev}>Household Income</option>
        <option value={this.props.county.standardDeviation.property_value_stdev}>Property Value</option>
        <option value={this.props.county.standardDeviation.commute_time_stdev}>Commute Time</option>
        <option value={this.props.county.standardDeviation.median_age_stdev}>Median Age</option>
      </select>
        <div className="map-container" />
        <ActiveCounty />
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
