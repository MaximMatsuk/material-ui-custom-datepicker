import React, { Component } from "react";
import { DatePicker, IconButton, TextField } from "material-ui";
import moment from "moment";
import InputMask from "react-input-mask";
require('./styles.css');

const styles = {
  floatingLabelFocusStyle: {
    color: "rgba(0, 0, 0, 0.3)"
  },
  underlineFocusStyle: {
    borderColor: "tranparent",
    border: "none"
  }
};


const INVALID_DATE = "Invalid Date";
//this format needs to compare dates without hours, minutes and seconds influence
const DATE_FORMAT_FOR_MATCHING = "YYYY-MM-DD";

export default class DatePickerField extends Component {
  static defaultProps = {
    maxDate: new Date(moment().add(100, "years")),
    minDate: new Date(moment().subtract(100, "years")),
    invalidDateError: "Значение поля должно соответствовать типу «Дата»",
    maxDateError: "Значение поля не должно быть позже чем {date}",
    minDateError: "Значение поля не должно быть раньше чем {date}",
    dateFormat: "DD.MM.YYYY",
    maskChar: "X",
    mask: "99.99.9999"
  };

  constructor(props) {
    super(props);

    this.state = {
      errorText: "",
      valueText: this.getDateString(this.props.value)
    };
  }

  componentWillReceiveProps = newProps => {
    !newProps.value &&
      this.setState({ errorText: "", valueText: this.getDateString("") });
  };

  isEmpty = dateString =>
    dateString === this.props.mask.replace(/9/g, this.props.maskChar);

  validateDateString = dateString => {
    const parsedDate = moment(dateString, this.props.dateFormat);
    if (
      !this.isEmpty(dateString) &&
      (!parsedDate.isValid() || dateString.includes(this.props.maskChar))
    ) {
      return this.props.invalidDateError;
    }
    if (
      parsedDate.format(DATE_FORMAT_FOR_MATCHING) >
      moment(this.props.maxDate).format(DATE_FORMAT_FOR_MATCHING)
    ) {
      return this.props.maxDateError.replace(
        "{date}",
        moment(this.props.maxDate).format(this.props.dateFormat)
      );
    }
    if (
      parsedDate.format(DATE_FORMAT_FOR_MATCHING) <
      moment(this.props.minDate).format(DATE_FORMAT_FOR_MATCHING)
    ) {
      return this.props.minDateError.replace(
        "{date}",
        moment(this.props.minDate).format(this.props.dateFormat)
      );
    }
    return "";
  };

  blurHandler = event => {
    this.setState({ errorText: this.validateDateString(event.target.value) });
    this.props.onBlur && this.props.onBlur(event);
  };

  changeHandler = (event, value) => {
    if (this.isEmpty(value)) {
      this.props.onChange(event, "");
    } else {
      const errors = this.validateDateString(value);
      if (errors) {
        this.props.onChange(event, INVALID_DATE);
      } else {
        this.props.onChange(
          event,
          new Date(moment(value, this.props.dateFormat))
        );
      }
    }
    this.setState({ valueText: value, errorText: " " });
  };

  datePickerHandler = (event, value) => {
    this.setState({ valueText: this.getDateString(value), errorText: "" });
    this.props.onChange(event, value);
  };

  getDateString = date => moment(date).format(this.props.dateFormat);

  //date values for calendar window
  getDateValue = value => {
    if (!value) {return {};}
    const parsedDate = moment(value, this.props.dateFormat);
    if (!parsedDate.isValid()) {
      return new Date();
    } else {
      if (parsedDate > moment(this.props.maxDate)) {
        return new Date(this.props.maxDate);
      }
      if (parsedDate < moment(this.props.minDate)) {
        return new Date(this.props.minDate);
      }
      return new Date(parsedDate);
    }
  };

  render() {
    return (
      <div className="datepicker-wrap">
        <div className="datepicker-wrap__text-field">
          <TextField
            className="datepicker-textfield-wrap"
            errorText={this.state.errorText || this.props.errorText}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            floatingLabelText={this.props.floatingLabelText}
            hintText={this.props.dateFormat}
            name={this.props.name}
            onBlur={this.blurHandler}
            onChange={this.changeHandler}
            underlineFocusStyle={styles.underlineFocusStyle}
            value={this.state.valueText}
          >
            <InputMask
              alwaysShowMask
              autoComplete="off"
              mask={this.props.mask}
              maskChar={this.props.maskChar}
              name={this.props.name}
              value={this.state.valueText}
            />
          </TextField>

          <IconButton
            className="datepicker-icon"
            onClick={() => this.datePicker.focus()}
          >
            <svg height="18px" id="Forma_1_1_" width="19px" version="1.1" viewBox="0 0 19 18" x="0px" y="0px" xmlSpace="preserve">
              <g id="Forma_1">
                <g>
                  <path d="M16.031,1.2h-2.375V0.6c0-0.36-0.237-0.6-0.594-0.6&#xA;&#x9;&#x9;&#x9;s-0.594,0.24-0.594,0.6v0.6H6.531V0.6c0-0.36-0.238-0.6-0.594-0.6S5.344,0.24,5.344,0.6v0.6H2.969C1.306,1.2,0,2.52,0,4.2V15&#xA;&#x9;&#x9;&#x9;c0,1.68,1.306,3,2.969,3h13.062C17.694,18,19,16.68,19,15V4.2C19,2.52,17.694,1.2,16.031,1.2z M17.812,15&#xA;&#x9;&#x9;&#x9;c0,0.96-0.831,1.8-1.781,1.8H2.969c-0.95,0-1.781-0.84-1.781-1.8V7.2h16.625V15z M17.813,6H1.188V4.2c0-0.96,0.831-1.8,1.781-1.8&#xA;&#x9;&#x9;&#x9;h2.375V3c0,0.36,0.237,0.6,0.594,0.6c0.356,0,0.594-0.24,0.594-0.6V2.4h5.938V3c0,0.36,0.237,0.6,0.594,0.6&#xA;&#x9;&#x9;&#x9;c0.356,0,0.594-0.24,0.594-0.6V2.4h2.375c0.95,0,1.781,0.84,1.781,1.8V6z M4.156,15c0.356,0,0.594-0.12,0.831-0.36&#xA;&#x9;&#x9;&#x9;c0.237-0.24,0.356-0.6,0.356-0.84c0-0.24-0.119-0.6-0.356-0.84c-0.475-0.48-1.187-0.48-1.663,0c-0.237,0.24-0.356,0.48-0.356,0.84&#xA;&#x9;&#x9;&#x9;c0,0.24,0.119,0.6,0.356,0.84C3.562,14.88,3.8,15,4.156,15z M4.156,11.4c0.356,0,0.594-0.12,0.831-0.36&#xA;&#x9;&#x9;&#x9;c0.237-0.24,0.356-0.6,0.356-0.84c0-0.24-0.119-0.6-0.356-0.84c-0.475-0.48-1.187-0.48-1.663,0C3.088,9.6,2.969,9.84,2.969,10.2&#xA;&#x9;&#x9;&#x9;c0,0.36,0.119,0.6,0.356,0.84C3.562,11.28,3.8,11.4,4.156,11.4z M7.719,15c0.356,0,0.594-0.12,0.831-0.36&#xA;&#x9;&#x9;&#x9;c0.238-0.24,0.356-0.6,0.356-0.84c0-0.24-0.119-0.6-0.356-0.84c-0.475-0.48-1.187-0.48-1.662,0c-0.238,0.24-0.356,0.6-0.356,0.84&#xA;&#x9;&#x9;&#x9;c0,0.24,0.119,0.6,0.356,0.84C7.125,14.88,7.363,15,7.719,15z M7.719,11.4c0.356,0,0.594-0.12,0.831-0.36&#xA;&#x9;&#x9;&#x9;c0.238-0.24,0.356-0.6,0.356-0.84c0-0.24-0.119-0.6-0.356-0.84c-0.475-0.48-1.187-0.48-1.662,0C6.65,9.6,6.531,9.96,6.531,10.2&#xA;&#x9;&#x9;&#x9;c0,0.24,0.119,0.6,0.356,0.84C7.125,11.28,7.363,11.4,7.719,11.4z M11.281,15c0.356,0,0.594-0.12,0.831-0.36&#xA;&#x9;&#x9;&#x9;s0.356-0.48,0.356-0.84s-0.119-0.6-0.356-0.84c-0.475-0.48-1.188-0.48-1.663,0c-0.237,0.24-0.356,0.6-0.356,0.84&#xA;&#x9;&#x9;&#x9;c0,0.24,0.119,0.6,0.356,0.84S10.925,15,11.281,15z M11.281,11.4c0.356,0,0.594-0.12,0.831-0.36c0.237-0.24,0.356-0.48,0.356-0.84&#xA;&#x9;&#x9;&#x9;c0-0.24-0.119-0.6-0.356-0.84c-0.475-0.48-1.188-0.48-1.663,0c-0.237,0.24-0.356,0.6-0.356,0.84c0,0.24,0.119,0.6,0.356,0.84&#xA;&#x9;&#x9;&#x9;C10.687,11.28,10.925,11.4,11.281,11.4z M14.844,15c0.356,0,0.594-0.12,0.831-0.36s0.356-0.6,0.356-0.84&#xA;&#x9;&#x9;&#x9;c0-0.24-0.119-0.6-0.356-0.84c-0.475-0.48-1.188-0.48-1.663,0c-0.237,0.24-0.356,0.48-0.356,0.84c0,0.24,0.119,0.6,0.356,0.84&#xA;&#x9;&#x9;&#x9;S14.487,15,14.844,15z M14.844,11.4c0.356,0,0.594-0.12,0.831-0.36c0.237-0.24,0.356-0.48,0.356-0.84c0-0.24-0.119-0.6-0.356-0.84&#xA;&#x9;&#x9;&#x9;c-0.475-0.48-1.188-0.48-1.663,0c-0.237,0.24-0.356,0.6-0.356,0.84c0,0.24,0.119,0.6,0.356,0.84&#xA;&#x9;&#x9;&#x9;C14.25,11.28,14.487,11.4,14.844,11.4z" fill="#B7B7B7"/>
                </g>
              </g>
            </svg>
          </IconButton>
        </div>

        <div className="datepicker-wrap__datepicker">
          <DatePicker
            autoOk={this.props.autoOk}
            cancelLabel={this.props.cancelLabel}
            className={this.props.className}
            container={this.props.container}
            DateTimeFormat={this.props.DateTimeFormat}
            defaultDate={this.props.defaultDate}
            dialogContainerStyle={this.props.dialogContainerStyle}
            disabled={this.props.disabled}
            disableYearSelection={this.props.disableYearSelection}
            firstDayOfWeek={this.props.firstDayOfWeek}
            formatDate={date => moment(date).format(this.props.dateFormat)}
            fullWidth={this.props.fullWidth}
            hideCalendarDate={this.props.hideCalendarDate}
            locale={this.props.locale}
            maxDate={this.props.maxDate}
            minDate={this.props.minDate}
            mode={this.props.mode}
            name={this.props.name}
            okLabel={this.props.okLabel}
            onChange={this.datePickerHandler}
            onClick={this.props.onClick}
            onDismiss={this.props.onDismiss}
            onFocus={this.props.onFocus}
            onShow={this.props.onShow}
            openToYearSelection={this.props.openToYearSelection}
            ref={c => {
              this.datePicker = c;
            }}
            shouldDisableDate={this.props.shouldDisableDate}
            style={this.props.style}
            textFieldStyle={this.props.textFieldStyle}
            utils={this.props.utils}
            value={this.getDateValue(this.props.value)}
          />
        </div>
      </div>
    );
  }
}
