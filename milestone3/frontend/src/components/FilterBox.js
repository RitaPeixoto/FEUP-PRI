import {useState} from 'react';
import {Autocomplete, Slider, TextField} from "@mui/material";
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles((theme) => ({
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

export default function FilterBox({title, filterType, options, step, filters, setFilters}) {
    const [isOpen, setIsOpen] = useState(false);

    function valuetext(value) {
        return value;
    }

    const handleChange = (value) => {
        setFilters(title, value);
    }

    const classes = useStyles();
    return (
        <div className="filter-box">
            <p className="filter-box-title" onClick={() => setIsOpen(!isOpen)}>{title}</p>
            <div className={`filter-box-items ${!isOpen ? "d-none" : ""}`}>
                {filterType === 'number' && (
                    <Slider
                        key={title}
                        value={filters}
                        className="filter-slider"
                        getAriaValueText={valuetext}
                        min={options[0].value}
                        max={options[1].value}
                        step={step}
                        valueLabelDisplay="auto"
                        marks={options}
                        onChange={(event, value) => handleChange(value)}
                    />
                )}
                {filterType === 'autocomplete' && (
                    <Autocomplete
                        multiple
                        id="search-autocomplete"
                        size="small"
                        value={filters}
                        onChange={(event, value) => handleChange(value)}
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
            </div>
        </div>
    )
}
