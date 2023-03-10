/**
 * @author Xi Pu
 * React component for the admin page.
 * It contains a date range picker and two buttons to download game 1 and game 2 separately.
 */

import React from "react";
import "../util/common_stylings/FullScreenDiv.css";
import axios from "axios";
import { CSVLink } from "react-csv";
import moment from "moment";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import ContinueButton from "../util/common_components/ContinueButton";

class Admin extends React.Component {
  constructor(props)  {
    super(props);
    this.gameOneDataLink = React.createRef();
    this.gameTwoDataLink = React.createRef();
    this.state = {
      data: "Initialize value",
      startDate: null,
      endDate: null,
      minDate: null,
    };
  }

  componentDidMount() {
    axios.get("/minDate").then((res) => {
      this.setState({ minDate: moment(res.data.minDate) });
    });
  }

  fetchGameOneData = () => {
    if (this.state.startDate === null || this.state.endDate === null) {
      alert("Please select a date range!");
      return;
    }
    axios
      .get("/download-game1", {
        params: {
          startDate: this.state.startDate.format(moment.HTML5_FMT.DATE),
          endDate: this.state.endDate.format(moment.HTML5_FMT.DATE),
        },
      })
      .then((res) => {
        this.setState({ data: res.data }, () => {
          setTimeout(() => {
            this.gameOneDataLink.current.link.click();
          }, 0);
        });
      });
  };

  fetchGameTwoData = () => {
    if (this.state.startDate === null || this.state.endDate === null) {
      alert("Please select a date range!");
      return;
    }
    axios
      .get("/download-game2", {
        params: {
          startDate: this.state.startDate.format(moment.HTML5_FMT.DATE),
          endDate: this.state.endDate.format(moment.HTML5_FMT.DATE),
        },
      })
      .then((res) => {
        this.setState({ data: res.data }, () => {
          setTimeout(() => {
            this.gameTwoDataLink.current.link.click();
          }, 0);
        });
      });
  };

  isOutsideRange = (date) => {
    return (
      moment(date).isAfter(moment(Date.now())) ||
      moment(date).isBefore(this.state.minDate)
    );
  };

  render() {
    return (
      <div>
        <p>
          Please select a date range to export data collected within the
          selected range
        </p>
        <DateRangePicker
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="end_date_id" // PropTypes.string.isRequired,
          minDate={this.state.minDate}
          maxDate={moment(Date.now())}
          isOutsideRange={this.isOutsideRange}
          onDatesChange={({ startDate, endDate }) =>
            this.setState({ startDate, endDate })
          } // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={(focusedInput) => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        />
        <br />
        <button onClick={this.fetchGameOneData}>Download Game 1 Data</button>
        {/*{ this.state.data ? <CSVLink data={this.state.data} ref={this.csvLink}>Download</CSVLink> : null }*/}
        <CSVLink
          data={this.state.data}
          filename="data.csv"
          className="hidden"
          ref={this.gameOneDataLink}
          target="_blank"
        />
        <button onClick={this.fetchGameTwoData}>Download Game 2 Data</button>
        <CSVLink
          data={this.state.data}
          filename="data.csv"
          className="hidden"
          ref={this.gameTwoDataLink}
          target="_blank"
        />
        <ContinueButton height='50px' width='200px' message="continue" route="/" disabled={false} />
      </div>
    );
  }
}

export default Admin;
