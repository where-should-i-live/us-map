import React, { Component } from "react";
import { connect } from "react-redux";
import ActiveCounty from "./ActiveCounty";
import Instructions from "./Legend";
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
      tooltip: "",
      temp: true,
      temp_val: 36,
      hi: true,
      hi_val: 22000,
      pv: true,
      pv_val: 19000,
      age: true,
      age_val: 22,
      c: true,
      c_val: 5
    };
  }

  async componentDidMount() {
    await this.props.getCountyData();
    await this.props.standardDeviation();
    await this.getAllTheData();
    await this.drawG();
    await this.drawCounties();
    this.shadeCounties();
    this.drawBorders();
    this.props.getActiveCounty(49049);
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
          combinedData[i].avg_temp = value.avg_temp;
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

    svg.append("g").attr("class", "g--counties");
  }

  async drawCounties() {
    const mapContext = this;
    const svg = d3.select(this.mapEl);
    const geoPath = d3.geoPath();
    const { allTheData } = this.state;

    svg
      .select("g")
      .selectAll("path")
      .data(allTheData)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("id", d => d.id)
      .on("click", function(d) {
        mapContext.props.getActiveCounty(d.id);
      })
      .on("mouseover", function(d) {
        mapContext.setState({
          tooltip: `${d.county_name}, ${d.county_state_name}`
        });
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
        const {
          hi,
          hi_val,
          temp,
          temp_val,
          pv,
          pv_val,
          age,
          age_val,
          c,
          c_val
        } = mapContext.state;
        const {
          household_income_stdev,
          avg_temp_stdev,
          property_value_stdev,
          median_age_stdev,
          commute_time_stdev
        } = mapContext.props.county.standardDeviation;
        const { activeCounty } = mapContext.props.county;

        const color8 = "#FEFFE0";
        const color7 = "rgb(254,255,207)";
        const color6 = "rgb(202,233,181)";
        const color5 = "rgb(133,204,187)";
        const color4 = "rgb(73,183,194)";
        const color3 = "rgb(50,128,181)";
        const color2 = "#205274";
        const color1 = "#173B53";

        let datasetArr = [
          {
            datatype: "household_income",
            input: Number(hi_val),
            sd: Number(household_income_stdev),
            include: hi
          },
          {
            datatype: "avg_temp",
            input: Number(temp_val),
            sd: Number(avg_temp_stdev),
            include: temp
          },
          {
            datatype: "property_value",
            input: Number(pv_val),
            sd: Number(property_value_stdev),
            include: pv
          },
          {
            datatype: "commute_time",
            input: Number(c_val),
            sd: Number(commute_time_stdev),
            include: c
          },
          {
            datatype: "median_age",
            input: Number(age_val),
            sd: Number(median_age_stdev),
            include: age
          }
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
              } else if (
                input - 2 * sd < datapoint &&
                datapoint < input + 2 * sd
              ) {
                weightArr.push(2);
              } else if (
                input - 3 * sd < datapoint &&
                datapoint < input + 3 * sd
              ) {
                weightArr.push(3);
              } else if (
                input - 4 * sd < datapoint &&
                datapoint < input + 4 * sd
              ) {
                weightArr.push(4);
              } else if (
                input - 5 * sd < datapoint &&
                datapoint < input + 5 * sd
              ) {
                weightArr.push(5);
              } else if (
                input - 6 * sd < datapoint &&
                datapoint < input + 6 * sd
              ) {
                weightArr.push(6);
              } else if (
                input - 7 * sd < datapoint &&
                datapoint < input + 7 * sd
              ) {
                weightArr.push(7);
              } else if (
                input - 8 * sd < datapoint &&
                datapoint < input + 8 * sd
              ) {
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

        if (activeCounty.county_id === Number(d.id)) {
          return "#fc2f70";
        } else if (weight < 2) {
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
          return "#ffffff";
        }
      });
  }

  render() {
    const {
      household_income_min,
      household_income_max,
      avg_temp_min,
      avg_temp_max,
      property_value_min,
      property_value_max,
      commute_time_min,
      commute_time_max,
      median_age_min,
      median_age_max
    } = this.props.county.standardDeviation;
    const {
      hi,
      hi_val,
      temp,
      temp_val,
      pv,
      pv_val,
      c,
      c_val,
      age,
      age_val
    } = this.state;
    return (
      <div className="map">
        <div className="info-section">
          <div className="title-bar">
            <h1>Adjust Sliders Below</h1>
          </div>
          <div className="data-filters">
            <div
              className="data-option"
              style={
                !temp
                  ? {
                      background: "hsla(0, 0%, 100%, 0.2)",
                      borderRadius: "5px",
                      alignItems: "center"
                    }
                  : null
              }
            >
              <div className="data-label">
                <p
                  className={temp ? "data-text strikethrough" : "data-text"}
                  style={!hi ? { color: "hsla(0, 0%, 100%, 0.6)" } : null}
                  onClick={() => this.setState({ temp: !temp })}
                >
                  <span className="label">Average Annual Temperature</span>
                </p>
                {temp ? (
                  <p className="active-val">
                    {temp_val}
                    <span>&#176;</span>F
                  </p>
                ) : null}
              </div>
              {temp ? (
                <div className="slide-row">
                  <p className="datapoint text-right">
                    {Math.round(avg_temp_min)}
                    <span>&#176;</span>F
                  </p>
                  <div className="slidecontainer">
                    <input
                      type="range"
                      className="slider"
                      step="1"
                      min={avg_temp_min}
                      max={avg_temp_max}
                      value={temp_val}
                      onChange={e =>
                        this.setState({
                          temp_val: Math.round(Number(e.target.value))
                        })
                      }
                    />
                  </div>
                  <p className="datapoint text-left">
                    {Math.floor(avg_temp_max)}
                    <span>&#176;</span>F
                  </p>
                </div>
              ) : null}
            </div>
            <div
              className="data-option"
              style={
                !hi
                  ? {
                      background: "hsla(0, 0%, 100%, 0.2)",
                      alignItems: "center",
                      borderRadius: "5px"
                    }
                  : null
              }
            >
              <div className="data-label">
                <p
                  className={hi ? "data-text strikethrough" : "data-text"}
                  style={!hi ? { color: "hsla(0, 0%, 100%, 0.6)" } : null}
                  onClick={() => this.setState({ hi: !hi })}
                >
                  <span className="label">Household Income</span>
                </p>
                {hi ? (
                  <p className="active-val">
                    ${Math.round(hi_val / 1000) * 1000}
                  </p>
                ) : null}
              </div>
              {hi ? (
                <div className="slide-row">
                  <p className="datapoint text-right">
                    ${Math.round(household_income_min / 1000) * 1000}
                  </p>
                  <div className="slidecontainer">
                    <input
                      type="range"
                      className="slider"
                      step="1"
                      min={household_income_min}
                      max={household_income_max}
                      value={hi_val}
                      onChange={e =>
                        this.setState({ hi_val: Number(e.target.value) })
                      }
                    />
                  </div>
                  <p className="datapoint text-left">
                    ${Math.round(household_income_max / 1000) * 1000}
                  </p>
                </div>
              ) : null}
            </div>
            <div
              className="data-option"
              style={
                !pv
                  ? {
                      background: "hsla(0, 0%, 100%, 0.2)",
                      borderRadius: "5px",
                      alignItems: "center"
                    }
                  : null
              }
            >
              <div className="data-label">
                <p
                  className={pv ? "data-text strikethrough" : "data-text"}
                  style={!pv ? { color: "hsla(0, 0%, 100%, 0.6)" } : null}
                  onClick={() => this.setState({ pv: !pv })}
                >
                  <span className="label">Property Value</span>
                </p>
                {pv ? (
                  <p className="active-val">
                    ${Math.round(pv_val / 1000) * 1000}
                  </p>
                ) : null}
              </div>
              {pv ? (
                <div className="slide-row">
                  <p className="datapoint text-right">
                    ${Math.round(property_value_min / 1000) * 1000}
                  </p>
                  <div className="slidecontainer">
                    <input
                      type="range"
                      className="slider"
                      step="1"
                      min={property_value_min}
                      max={property_value_max}
                      value={pv_val}
                      onChange={e =>
                        this.setState({ pv_val: Number(e.target.value) })
                      }
                    />
                  </div>
                  <p className="datapoint text-left">
                    ${Math.round(property_value_max / 1000) * 1000}
                  </p>
                </div>
              ) : null}
            </div>
            <div
              className="data-option"
              style={
                !c
                  ? {
                      background: "hsla(0, 0%, 100%, 0.2)",
                      borderRadius: "5px",
                      alignItems: "center"
                    }
                  : null
              }
            >
              <div className="data-label">
                <p
                  className={c ? "data-text strikethrough" : "data-text"}
                  style={!c ? { color: "hsla(0, 0%, 100%, 0.6)" } : null}
                  onClick={() => this.setState({ c: !c })}
                >
                  <span className="label">Commute Time</span>
                </p>
                {c ? (
                  <p className="active-val">{Math.round(c_val)} minutes</p>
                ) : null}
              </div>
              {c ? (
                <div className="slide-row">
                  <p className="datapoint text-right">
                    {Math.round(commute_time_min)} min
                  </p>
                  <div className="slidecontainer">
                    <input
                      type="range"
                      className="slider"
                      step="1"
                      min={commute_time_min}
                      max={commute_time_max}
                      value={c_val}
                      onChange={e =>
                        this.setState({
                          c_val: Math.round(Number(e.target.value))
                        })
                      }
                    />
                  </div>
                  <p className="datapoint text-left">
                    {Math.floor(commute_time_max)} min
                  </p>
                </div>
              ) : null}
            </div>
            <div
              className="data-option"
              style={
                !age
                  ? {
                      background: "hsla(0, 0%, 100%, 0.2)",
                      borderRadius: "5px",
                      alignItems: "center"
                    }
                  : null
              }
            >
              <div className="data-label">
                <p
                  className={age ? "data-text strikethrough" : "data-text"}
                  style={!age ? { color: "hsla(0, 0%, 100%, 0.6)" } : null}
                  onClick={() => this.setState({ age: !age })}
                >
                  <span className="label">Median Age</span>
                </p>
                {age ? <p className="active-val">{age_val} years</p> : null}
              </div>
              {age ? (
                <div className="slide-row">
                  <p className="datapoint text-right">
                    {Math.round(median_age_min)} yrs
                  </p>
                  <div className="slidecontainer">
                    <input
                      type="range"
                      className="slider"
                      step="1"
                      min={median_age_min}
                      max={median_age_max}
                      value={age_val}
                      onChange={e =>
                        this.setState({
                          age_val: Math.round(Number(e.target.value))
                        })
                      }
                    />
                  </div>
                  <p className="datapoint text-left">
                    {Math.round(median_age_max)} yrs
                  </p>
                </div>
              ) : null}
            </div>
          </div>
          <Instructions />
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
