import React, { Component } from "react";
import { DatePicker, IconButton, TextField } from "material-ui";
import ActionDateRange from "material-ui/svg-icons/action/date-range";
import moment from "moment";
import InputMask from "react-input-mask";
import "styles.less";

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
            <ActionDateRange />
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
