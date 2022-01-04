import {useState} from 'react';
import {Autocomplete, Slider, TextField} from "@mui/material";
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiAutocomplete-root": {
            backgroundColor: "red"
        }
    },
    inputRoot: {
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none"
        }
    }
}));

export default function FilterBox({title, filterType, options, step}) {
    const [isOpen, setIsOpen] = useState(false);

    function valuetext(value) {
        return value;
    }

    const classes = useStyles();
    return (
        <div className="filter-box">
            <p className="filter-box-title" onClick={() => setIsOpen(!isOpen)}>{title}</p>
            <ul className={`bookformat-list filter-box-items ${!isOpen ? "d-none" : ""}`}>
                {filterType === 'number' && (
                    <Slider
                        key={title}
                        value={[options[0].value, options[1].value]}
                        className="filter-slider"
                        getAriaValueText={valuetext}
                        min={options[0].value}
                        max={options[1].value}
                        step={step}
                        valueLabelDisplay="auto"
                        marks={options}
                    />
                )}
                {filterType === 'autocomplete' && (
                    <Autocomplete
                        multiple
                        id="search-auotcomplete"
                        size="small"
                        options={options.sort((a, b) => -b.charAt(0).localeCompare(a.charAt(0)))}
                        groupBy={(option) => option.charAt(0)}
                        classes={classes}
                        limitTags={3}
                        ListboxProps={{style: {maxHeight: '200px', overflow: 'auto'}}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={`Choose ${title}`}
                            />
                        )}
                    />
                )}
            </ul>
        </div>
    )
}
