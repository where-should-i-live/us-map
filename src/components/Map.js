import React, { Component } from "react";
import { connect } from "react-redux";
import ActiveCounty from "./ActiveCounty";
import {
  getCountyData,
  standardDeviation,
  getActiveCounty
} from "./../ducks/countyReducer";
import { addFavorite } from "./../ducks/favoritesReducer";

// import ReactDOM from "react-dom";
// ReactDOM.render(document.getElementById("app"));
import * as d3 from "d3";
import * as topojson from "topojson-client";

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allTheData: [],
      usGeoData: {},
      temp: true,
        temp_val: 55,
      hi: true,
      hi_val: 60336,
      pv: true,
        pv_val: 217600,
      age: true,
        age_val: 38,
      c: true,
      c_val: 22.29
    };
  }

  async componentDidMount() {
    await this.props.getCountyData();
    await this.props.standardDeviation();
    await this.getAllTheData();
    await this.drawG();
    await this.drawCounties();
    await this.shadeCounties();
    await this.drawBorders();
  }

  componentDidUpdate() {
    this.shadeCounties();
  }

  async getAllTheData() {
    const d3data = await fetch("https://d3js.org/us-10m.v1.json");
    const usGeoData = await d3data.json();
    const topojsonFeatureData = await topojson.feature(
      usGeoData,
      usGeoData.objects.counties
    ).features;
    const countyData = await this.props.county.countyData;

    let combinedData = topojsonFeatureData;
    function combineTheData() {
      for (let i = 0; i < topojsonFeatureData.length; i++) {
        let value = countyData.find(
          county =>
            Number(county.county_id) === Number(topojsonFeatureData[i].id)
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
      return combinedData;
    }

    combineTheData();
    this.setState({
      allTheData: combinedData,
      usGeoData: usGeoData
    });
  }

  async drawBorders() {
    const svg = d3.select(this.mapEl);
    const geoPath = d3.geoPath();
    const { usGeoData } = this.state;
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

  async drawG() {
    const svg = d3.select(this.mapEl);

    svg
      .append("g")
      .attr("class", "g--counties")
  }

  async drawCounties() {
    const mapContext = this;
    const svg = d3.select(this.mapEl);
    const geoPath = d3.geoPath();
    const { allTheData } = this.state;

    svg
      .select('g')
      .selectAll("path")
      .data(allTheData)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("id", d => d.id)
      .on("click", function(d) {
        mapContext.props.getActiveCounty(d.id);
      });
  }

  async shadeCounties() {
    const mapContext = this;
    const svg = d3.select(this.mapEl);
    const { allTheData } = this.state;
    svg
      .selectAll("path")
      .data(allTheData)
      .transition()
      .duration(1000)
      .attr("fill", function shader(d) {
        const {hi, hi_val, temp, temp_val, pv, pv_val, age, age_val, c, c_val} = mapContext.state
        const {household_income_stdev, avg_temp_stdev, property_value_stdev, median_age_stdev, commute_time_stdev} = mapContext.props.county.standardDeviation;

        const color8 = "#edfdff";
        const color7 = "#a6f7ff";
        const color6 = "#71f3ff";
        const color5 = "#3cefff";
        const color4 = "#32c4d1";
        const color3 = "#21838c";
        const color2 = "#16575d";
        const color1 = "#0b2c2f";

        let datasetArr = [
                  {datatype: 'household_income', input: Number(hi_val), sd: Number(household_income_stdev), include: hi},
                  {datatype: 'avg_temp', input: Number(temp_val), sd: Number(avg_temp_stdev), include: temp},
                  {datatype: 'property_value', input: Number(pv_val), sd: Number(property_value_stdev), include: pv},
                  {datatype: 'commute_time', input: Number(c_val), sd: Number(commute_time_stdev), include: c},
                  {datatype: 'median_age', input: Number(age_val), sd: Number(median_age_stdev), include: age}
                ];
        
        let weightArr = [];
        let weight;

        function calcWeight() {
          for (let i = 0; i < datasetArr.length; i++) {
            let { input, sd, datatype, include } = datasetArr[i];
            let datapoint = Number(d[datatype]);

            if (include) {
              if (input - sd < datapoint && datapoint < input + sd) {
                weightArr.push(1);
              } else if (input - 2 * sd < datapoint && datapoint < input + 2 * sd) {
                weightArr.push(2);
              } else if (input - 3 * sd < datapoint && datapoint < input + 3 * sd) {
                weightArr.push(3);
              } else if (input - 4 * sd < datapoint && datapoint < input + 4 * sd) {
                weightArr.push(4);
              } else if (input - 5 * sd < datapoint && datapoint < input + 5 * sd) {
                weightArr.push(5);
              } else if (input - 6 * sd < datapoint && datapoint < input + 6 * sd) {
                weightArr.push(6);
              } else if (input - 7 * sd < datapoint && datapoint < input + 7 * sd) {
                weightArr.push(7);
              } else if (input - 8 * sd < datapoint && datapoint < input + 8 * sd) {
                weightArr.push(8);
              } else {
                weightArr.push(9);
              }
            }
          }
          return (weight =
            Number(weightArr.reduce((total, current) => total + current, 0)) /
            weightArr.length);
        }
        calcWeight();

        if (weight < 2) {
          return color1;
        } else if (weight < 3) {
          return color2;
        } else if (weight < 4) {
          return color3;
        } else if (weight < 5) {
          return color4;
        } else if (weight < 6) {
          return color5;
        } else if (weight < 7) {
          return color6;
        } else if (weight < 8) {
          return color7;
        } else if (weight < 9) {
          return color8;
        } else {
          return "white";
        }
      })
  }

  render() {
    // let counties = data.map(county => <path />)
    const {household_income_min, household_income_max, avg_temp_min, avg_temp_max, property_value_min, property_value_max, commute_time_min, commute_time_max, median_age_min, median_age_max} = this.props.county.standardDeviation;
    const {hi, hi_val, temp, temp_val, pv, pv_val, c, c_val, age, age_val} = this.state;
    return (
      <div className="map">
          <div className='info-section'>
              <div className='data-filters'>
                <div className='data-option' style={!hi ? {background: 'hsla(0, 0%, 100%, 0.2)', borderRadius: '5px'} : null}>
                  <div className='data-label'>
                    <p className={hi ? 'data-text strikethrough' : 'data-text'} style={!hi ? {color: 'hsla(0, 0%, 100%, 0.6)'} : null} onClick={() => this.setState({hi: !hi})}>Household Income</p>
                    {hi ? <p className='active-val'>${hi_val}</p> : null}
                  </div>
                  {hi ?
                    <div className='slide-row'>
                        <p className='datapoint text-right'>${household_income_min}</p>
                        <div className='slidecontainer'>
                          <input  type='range'
                                  className='slider'
                                  step='1'
                                  min={household_income_min}
                                  max={household_income_max}
                                  value={hi_val}
                                  onChange={(e) => this.setState({hi_val: Number(e.target.value)})}/>
                        </div>
                        <p className='datapoint text-left'>${household_income_max}</p>
                    </div>
                  :
                  null}
                </div>
                <div className='data-option' style={!temp ? {background: 'hsla(0, 0%, 100%, 0.2)', borderRadius: '5px'} : null}>
                  <div className='data-label'>
                    <p className={temp ? 'data-text strikethrough' : 'data-text'} style={!hi ? {color: 'hsla(0, 0%, 100%, 0.6)'} : null} onClick={() => this.setState({temp: !temp})}>Average Temperature</p>
                    {temp ? <p className='active-val'>{temp_val} <span>&#176;</span>F</p> : null}
                  </div>
                  {temp ?
                    <div className='slide-row'>
                        <p className='datapoint text-right'>{avg_temp_min} <span>&#176;</span>F</p>
                        <div className='slidecontainer'>
                          <input  type='range'
                                  className='slider'
                                  step='1'
                                  min={avg_temp_min}
                                  max={avg_temp_max}
                                  value={temp_val}
                                  onChange={(e) => this.setState({temp_val: Number(e.target.value)})}/>
                        </div>
                        <p className='datapoint text-left'>{avg_temp_max} <span>&#176;</span>F</p>
                    </div>
                  :
                  null}
                </div>
                <div className='data-option' style={!pv ? {background: 'hsla(0, 0%, 100%, 0.2)', borderRadius: '5px'} : null}>
                  <div className='data-label'>
                    <p className={pv ? 'data-text strikethrough' : 'data-text'} style={!pv ? {color: 'hsla(0, 0%, 100%, 0.6)'} : null} onClick={() => this.setState({pv: !pv})}>Property Value</p>
                    {pv ? <p className='active-val'>${pv_val}</p> : null}
                  </div>
                  {pv ?
                    <div className='slide-row'>
                        <p className='datapoint text-right'>${property_value_min}</p>
                        <div className='slidecontainer'>
                          <input  type='range'
                                  className='slider'
                                  step='1'
                                  min={property_value_min}
                                  max={property_value_max}
                                  value={pv_val}
                                  onChange={(e) => this.setState({pv_val: Number(e.target.value)})}/>
                        </div>
                        <p className='datapoint text-left'>${property_value_max}</p>
                    </div>
                  :
                  null}
                </div>
                <div className='data-option' style={!c ? {background: 'hsla(0, 0%, 100%, 0.2)', borderRadius: '5px'} : null}>
                  <div className='data-label'>
                    <p className={c ? 'data-text strikethrough' : 'data-text'} style={!c ? {color: 'hsla(0, 0%, 100%, 0.6)'} : null} onClick={() => this.setState({c: !c})}>Commute Time</p>
                    {c ? <p className='active-val'>{c_val} minutes</p> : null}
                  </div>
                  {c ?
                    <div className='slide-row'>
                      <p className='datapoint text-right'>{commute_time_min} min</p>
                      <div className='slidecontainer'>
                        <input  type='range'
                                className='slider'
                                step='1'
                                min={commute_time_min}
                                max={commute_time_max}
                                value={c_val}
                                onChange={(e) => this.setState({c_val: Number(e.target.value)})}/>
                      </div>
                      <p className='datapoint text-left'>{commute_time_max} min</p>
                    </div>
                  : null}
                </div>
                <div className='data-option' style={!age ? {background: 'hsla(0, 0%, 100%, 0.2)', borderRadius: '5px'} : null}>
                  <div className='data-label'>
                    <p className={age ? 'data-text strikethrough' : 'data-text'} style={!age ? {color: 'hsla(0, 0%, 100%, 0.6)'} : null} onClick={() => this.setState({age: !age})}>Median Age</p>
                    {age ? <p className='active-val'>{age_val} years</p> : null}
                  </div>
                  {age ?
                    <div className='slide-row'>
                      <p className='datapoint text-right'>{median_age_min} yrs</p>
                      <div className='slidecontainer'>
                        <input  type='range'
                                className='slider'
                                step='1'
                                min={median_age_min}
                                max={median_age_max}
                                value={age_val}
                                onChange={(e) => this.setState({age_val: Number(e.target.value)})}/>
                      </div>
                      <p className='datapoint text-left'>{median_age_max} yrs</p>
                    </div>
                  : null}
                </div>
              </div>
            <ActiveCounty />
          </div>
          <div className="map-container">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 960 600"
            ref={el => (this.mapEl = el)}
          />
        </div>
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
