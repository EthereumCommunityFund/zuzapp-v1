import React from 'react';
import TimezoneSelect from 'react-timezone-select';
import type {
  ITimezone,
  ITimezoneOption,
} from 'react-timezone-select';

export type ISelectStyle = 'react-select';

const TimezoneSelector = ({
  value,
  onChange,
}: Props) => {
  return (
    <TimezoneSelect
      value={value}
      onChange={onChange}
      labelStyle={'abbrev'}
      styles={{
        control(base, props) {
          return {
            backgroundColor: '#242727',
            display: 'flex',
          }
        },
        valueContainer(base, props) {
          return {
            display: 'flex',
            paddingTop: '10px',
            paddingLeft: '10px',
            justifyContent: 'stretch',
            width: '100%'
          }
        },
        singleValue(base, props) {
          return {
            color: 'white',
            cursor: 'pointer',
          }
        },
        menuList(base, props) {
          return {
            backgroundColor: '#242727',
            maxHeight: '200px',
            overflowY: 'auto',
            ":active": {
              backgroundColor: '#393C3C'
            }
          }
        },
        option(base, props) {
          return {
            paddingLeft: '10px',
            paddingBottom: '5px',
            paddingTop: '5px',
            ":hover": {
              backgroundColor: '#393C3C',
              cursor: 'pointer'
            }
          }
        },
      }}
    />
  );
};

type Props = {
  value: ITimezone;
  onChange?: (timezone: ITimezoneOption) => void;
};

export default TimezoneSelector;