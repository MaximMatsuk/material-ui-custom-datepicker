# material-ui-custom-datepicker

Custom DatePicker component, that includes connected material-ui DatePicker and TextField components.
react-input-mask is used for cutting useless symbols. There is common presence, max value, min value and date format validation.

### Installing

```
npm install material-ui-custom-datepicker
```

### Usage

```
import React from "react";
import {DatePicker} from "material-ui-custom-datepicker";


class myDatePicker extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: new Date()
    }
  }  
  
  handleChange = (event, value) => {
    this.setState({value});
  }
    
  render(){
    return (
      <DatePicker
        name="birthDate"
        value={this.state.value}
        onChange={this.handleChange}  
        floatingLabelText="Birthday"
        autoOk
        cancelLabel="Back"
        minDate={new Date(1900, 0, 1)}
        maxDate={new Date(2100, 0, 1)}
      />
    );
  }
}
```

Component support all default DatePicker and TextField material-ui properties. Additional ones are:
* invalidDateError - invalid date format error
* maxDateError - "too late date" error
* minDateError - "too early date" error
* dateInputFormat - date format in TextField
* dateValueFormat - date value format
* maskChar - maskChar of react-input-mask
* mask - mask of react-input-mask

In max and min date errors max and min values are inserting instead of "{date}".

