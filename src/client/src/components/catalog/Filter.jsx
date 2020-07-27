import React, { Component } from "react";
import style from "./Filter.module.css";
import { fetchCatalogRequest, fetchCatalogListSuccess } from "../../redux/action";
import { connect } from "react-redux";
import { Router, Link } from "react-router-dom";
import { node } from "prop-types";
import queryString from "query-string";
import Gallery from "./Gallery";

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: [],
      minPrice: 100,
      page: 1,
      perPage: 10,
    };
  }

  componentDidMount() {
    const { fetchCatalogRequest, history, location, match } = this.props;
    const values = queryString.parse(this.props.location.search);
    this.setState({
      feature: values.feature || [],
      minPrice: values.minPrice || 100,
      sort: values.sort || "Recommended",
      perPage: values.perPage > 10 ? values.perPage : 10,
    });
    // console.log(
    //   location.search.replace(
    //     /[(%20)(&)(feature=)(minPrice=)(sort=)(perPage=)]/g,
    //     ""
    //   )
    // );
    fetchCatalogRequest(`${location.pathname}${location.search}`);
  }

  handleOnChange = (e) => {
    const { id } = e.target;
    const { features, minPrice, perPage } = this.state;
    const { location, history, match } = this.props;
    let index = features.indexOf(id);
    index == -1 ? features.push(id) : features.splice(index, 1);
    this.setState({
      features,
    });

    //uri construction
    let url = match.url[match.url.length - 1] !== "/" ? match.url : match.url;
    console.log(url, "url");

    if (features.length > 0) {
      let stringArr = features.map((ele, i) =>
        i == 0 ? `?feature=${ele}` : `&feature=${ele}`
      );
      url += stringArr.join("");
      url += minPrice !== 100 ? `&minPrice=${minPrice}` : "";
      url += perPage > 10 ? `&perPage=${perPage}` : "";
    } else {
      if (minPrice !== 100 && perPage > 10) {
        url += `?minPrice=${minPrice}&perPage=${perPage}`;
      } else if (minPrice !== 100) {
        url += `?minPrice=${minPrice}`;
      } else if (perPage > 10) {
        url += `?perPage=${perPage}`;
      }
    }

    history.push(url);
    this.props.fetchCatalogRequest(url);
  };

  handlePriceChange = (e) => {
    const { features, minPrice, perPage } = this.state;
    const { location, history, match } = this.props;

    this.setState({
      minPrice: e.target.valueAsNumber,
    });

    let url = match.url[match.url.length - 1] !== "/" ? match.url : match.url;
    console.log(url, "url");

    if (features.length > 0) {
      let stringArr = features.map((ele, i) =>
        i == 0 ? `?feature=${ele}` : `&feature=${ele}`
      );
      url += stringArr.join("");
      url +=
        e.target.valueAsNumber !== 100
          ? `&minPrice=${e.target.valueAsNumber}`
          : "";
      url += perPage > 10 ? `&perPage=${perPage}` : "";
    } else {
      if (e.target.valueAsNumber !== 100 && perPage > 10) {
        url += `?minPrice=${e.target.valueAsNumber}&perPage=${perPage}`;
      } else if (e.target.valueAsNumber !== 100) {
        url += `?minPrice=${e.target.valueAsNumber}`;
      } else if (perPage > 10) {
        url += `?perPage=${perPage}`;
      }
    }

    history.push(url);
    this.props.fetchCatalogRequest(url);
  };

  handlePerPageChange = (e) => {
    const { features, minPrice, perPage } = this.state;
    const { location, history, match } = this.props;

    this.setState({
      perPage: e.target.id,
    });
    let url = match.url[match.url.length - 1] !== "/" ? match.url : match.url;
    console.log(url, "url");

    if (features.length > 0) {
      let stringArr = features.map((ele, i) =>
        i == 0 ? `?feature=${ele}` : `&feature=${ele}`
      );
      url += stringArr.join("");
      url += minPrice !== 100 ? `&minPrice=${minPrice}` : "";
      url += e.target.id > 10 ? `&perPage=${e.target.id}` : "";
    } else {
      if (minPrice !== 100 && e.target.id > 10) {
        url += `?minPrice=${minPrice}&perPage=${e.target.id}`;
      } else if (minPrice !== 100) {
        url += `?minPrice=${minPrice}`;
      } else if (e.target.id > 10) {
        url += `?perPage=${e.target.id}`;
      }
    }

    history.push(url);
    this.props.fetchCatalogRequest(url);
  };

  render() {
    const { history, location, match } = this.props;
    const { fetchCatalogRequest, fetchCatalogListSuccess } = this.props;
    const values = queryString.parse(this.props.location.search);

    console.log(
      values.feature,
      values.minPrice,
      values.sort,
      values.perPage,
      "values"
    );
    // console.log(
    //   location.search.replace(
    //     /(%20)(&)(feature=)(minPrice=)(sort=)(perPage=)/g,
    //     ""
    //   )
    // );
    return (
      <div className="row">
        <div className="col-2 offset-lg-1">
          <div className="card mb-3" style={{ height: "8rem", width: "16rem" }}>
            <div className="card-body">
              <div class="form-group">
                <label for="formControlRange">Price per night</label>
                <input
                  type="range"
                  class="form-control-range"
                  id="formControlRange"
                  min="100"
                  max="5000"
                  step="200"
                  value={`${this.state.minPrice}`}
                  onChange={(e) => this.handlePriceChange(e)}
                />
              </div>
            </div>
          </div>
          <div class="card" style={{ width: "16rem" }}>
            <div className="card-header">Features</div>
            <div class="card">
              <div className="card-body">
                <div className="bold">Accessibility</div>
                <br />
                <div className="custom-control custom-checkbox">
                  <input
                    checked={location.search.includes("pets")}
                    type="checkbox"
                    className="custom-control-input"
                    id="pets welcome"
                    onChange={(e) => this.handleOnChange(e)}
                  />
                  <label className="custom-control-label" for="pets welcome">
                    Pets welcome
                  </label>
                </div>
              </div>
            </div>
            <div class="card">
              <div className="card-body">
                {/* <div> */}
                <div className="bold">Bedroom amenities</div>
                <br />
                <div className="custom-control custom-checkbox">
                  <input
                    onChange={(e) => this.handleOnChange(e)}
                    checked={location.search.includes("double")}
                    type="checkbox"
                    className="custom-control-input"
                    id="double bed"
                  />
                  <label className="custom-control-label" for="double bed">
                    Double bed
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    // e.target.setAttribute("checked", !e.target.checked);
                    onChange={(e) => {
                      this.handleOnChange(e);
                    }}
                    checked={location.search.includes("king")}
                    type="checkbox"
                    className="custom-control-input"
                    id="king size bed"
                  />
                  <label className="custom-control-label" for="king size bed">
                    King size bed
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    onChange={(e) => this.handleOnChange(e)}
                    checked={location.search.includes("single")}
                    type="checkbox"
                    className="custom-control-input"
                    id="single bed"
                  />
                  <label className="custom-control-label" for="single bed">
                    Single bed
                  </label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input
                    onChange={(e) => this.handleOnChange(e)}
                    checked={location.search.includes("super")}
                    type="checkbox"
                    className="custom-control-input"
                    id="super king size bed"
                  />
                  <label
                    className="custom-control-label"
                    for="super king size bed"
                  >
                    Super king size bed
                  </label>
                </div>
                <div className="custom-control custom-checkbox"></div>
                {/* </div> */}
              </div>
            </div>
            <div class="card">
              <div className="card-body">
                <div>
                  <div className="bold">Entertainment amenities</div>
                  <br />
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("toys")}
                      type="checkbox"
                      className="custom-control-input"
                      id="children's toys"
                    />
                    <label
                      className="custom-control-label"
                      for="children's toys"
                    >
                      Children's toys
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("satellite")}
                      type="checkbox"
                      className="custom-control-input"
                      id="satellite or cable"
                    />
                    <label
                      className="custom-control-label"
                      for="satellite or cable"
                    >
                      Satellite or cable
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div className="card-body">
                <div>
                  <div className="bold">Equipment</div>
                  <br />
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("washing")}
                      type="checkbox"
                      className="custom-control-input"
                      id="washing machine"
                    />
                    <label
                      className="custom-control-label"
                      for="washing machine"
                    >
                      Washing machine
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("tumble")}
                      type="checkbox"
                      className="custom-control-input"
                      id="tumble dryer"
                    />
                    <label className="custom-control-label" for="tumble dryer">
                      Tumble dryer
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("washer")}
                      type="checkbox"
                      className="custom-control-input"
                      id="washer dryer"
                    />
                    <label className="custom-control-label" for="washer dryer">
                      Washer dryer
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div className="card-body">
                <div>
                  <div className="bold">Family</div>
                  <br />
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("babies")}
                      type="checkbox"
                      className="custom-control-input"
                      id="babies welcome"
                    />
                    <label
                      className="custom-control-label"
                      for="babies welcome"
                    >
                      Babies welcome
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("toddlers")}
                      type="checkbox"
                      className="custom-control-input"
                      id="toddlers welcome"
                    />
                    <label
                      className="custom-control-label"
                      for="toddlers welcome"
                    >
                      Toddlers welcome
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("children")}
                      type="checkbox"
                      className="custom-control-input"
                      id="children welcome"
                    />
                    <label
                      className="custom-control-label"
                      for="children welcome"
                    >
                      Children welcome
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div className="card-body">
                <div>
                  <div className="bold">Kitchen amenities</div>
                  <br />
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("Dishwasher")}
                      type="checkbox"
                      className="custom-control-input"
                      id="Dishwasher"
                    />
                    <label className="custom-control-label" for="Dishwasher">
                      Dishwasher
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("electric")}
                      type="checkbox"
                      className="custom-control-input"
                      id="hob electric"
                    />
                    <label className="custom-control-label" for="hob electric">
                      Hob electric
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("gas")}
                      type="checkbox"
                      className="custom-control-input"
                      id="hob gas"
                    />
                    <label className="custom-control-label" for="hob gas">
                      Hob gas
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("induction")}
                      type="checkbox"
                      className="custom-control-input"
                      id="hob induction"
                    />
                    <label className="custom-control-label" for="hob induction">
                      Hob induction
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("Oven")}
                      type="checkbox"
                      className="custom-control-input"
                      id="Oven"
                    />
                    <label className="custom-control-label" for="Oven">
                      Oven
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("Microwave")}
                      type="checkbox"
                      className="custom-control-input"
                      id="Microwave"
                    />
                    <label className="custom-control-label" for="Microwave">
                      Microwave
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div className="card-body">
                <div className="bold">Pool amenities</div>
                <br />

                <div className="custom-control custom-checkbox">
                  <input
                    onChange={(e) => this.handleOnChange(e)}
                    checked={location.search.includes("swimming")}
                    type="checkbox"
                    className="custom-control-input"
                    id="swimming pool"
                  />
                  <label className="custom-control-label" for="swimming pool">
                    Swimming pool
                  </label>
                </div>
                <div className="custom-control custom-checkbox"></div>
              </div>
            </div>
            <div class="card">
              <div className="card-body">
                <div>
                  <div className="bold">Property features</div>
                  <br />
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("conditioning")}
                      type="checkbox"
                      className="custom-control-input"
                      id="air conditioning"
                    />
                    <label
                      className="custom-control-label"
                      for="air conditioning"
                    >
                      Air-conditioning
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("balcony")}
                      type="checkbox"
                      className="custom-control-input"
                      id="balcony terrace"
                    />
                    <label
                      className="custom-control-label"
                      for="balcony terrace"
                    >
                      Balcony terrace
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("Elevator")}
                      type="checkbox"
                      className="custom-control-input"
                      id="Elevator"
                    />
                    <label className="custom-control-label" for="Elevator">
                      Elevator
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("garden")}
                      type="checkbox"
                      className="custom-control-input"
                      id="garden"
                    />
                    <label className="custom-control-label" for="garden">
                      Garden
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("road")}
                      type="checkbox"
                      className="custom-control-input"
                      id="off road parking"
                    />
                    <label
                      className="custom-control-label"
                      for="off road parking"
                    >
                      Off Road Parking
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("roof")}
                      type="checkbox"
                      className="custom-control-input"
                      id="roof terrace garden"
                    />
                    <label
                      className="custom-control-label"
                      for="roof terrace garden"
                    >
                      Roof terrace garden
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("secure")}
                      type="checkbox"
                      className="custom-control-input"
                      id="secure parking"
                    />
                    <label
                      className="custom-control-label"
                      for="secure parking"
                    >
                      Secure parking
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div className="card-body">
                <div>
                  <div className="bold">Room features</div>
                  <br />
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("Gym")}
                      type="checkbox"
                      className="custom-control-input"
                      id="Gym"
                    />
                    <label className="custom-control-label" for="Gym">
                      Gym
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      onChange={(e) => this.handleOnChange(e)}
                      checked={location.search.includes("Ensuite")}
                      type="checkbox"
                      className="custom-control-input"
                      id="ensuite"
                    />
                    <label className="custom-control-label" for="ensuite">
                      Ensuite
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="row">
            <div className="col-2 offset-md-3 offset-lg-1">hotel count</div>
            <div className="col-3 offset-lg-2">
              <button
                id="10"
                onClick={(e) => this.handlePerPageChange(e)}
                className={`px-2 ${style.perPage}`}
                // to={`/search${location.pathname}${location.search}&perPage=${this.state.perPage}`}
              >
                10
              </button>
              <button
                id="30"
                onClick={(e) => this.handlePerPageChange(e)}
                className={`px-2 ${style.perPage}`}
                // to={`/search${location.pathname}${location.search}&perPage=${this.state.perPage}`}
              >
                30
              </button>
              <button
                id="50"
                onClick={(e) => this.handlePerPageChange(e)}
                className={`px-2 ${style.perPage}`}
                // to={`/search${location.pathname}${location.search}&perPage=${this.state.perPage}`}
              >
                50
              </button>
              <span>per page</span>
            </div>
            <div className="col-2">
              <div class="form-group">
                <select
                  onChange={(e) => {
                    this.setState({
                      sort: e.target.value,
                    });
                    if (location.search == "")
                      this.props.history.push(
                        `${match.url}/?sort=${e.target.value}`
                      );
                    else
                      this.props.history.push(
                        `${match.url}&sort=${e.target.value}`
                      );
                  }}
                  class="form-control"
                  id="sort"
                >
                  <option selected>Sort</option>
                  <option value="Recommended">Recommended</option>
                  <option value="RecentlyAdded">Recently added</option>
                  <option value="SleepsMost">Sleeps (most)</option>
                  <option value="SleepsFewest">Sleeps (fewest)</option>
                  <option value="PriceHighest">Price (highest)</option>
                  <option value="PriceLowest">Price (lowest)</option>
                </select>
              </div>
            </div>
          </div>
          <Gallery {...this.props} />
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  fetchCatalogRequest: (payload) => dispatch(fetchCatalogRequest(payload)),
  fetchCatalogListSuccess: (payload) => dispatch(fetchCatalogListSuccess(payload)),
});
export default connect(null, mapDispatchToProps)(Filter);
