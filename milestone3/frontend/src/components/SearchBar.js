import {
  Accordion,
  AccordionContext,
  Button,
  Col,
  Form,
  Row,
  useAccordionButton,
} from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useContext, useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typeahead } from "react-bootstrap-typeahead";

import axios from "axios";

import "react-bootstrap-typeahead/css/Typeahead.css";

function CustomToggle({ eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  if (isCurrentEventKey)
    return (
      <ExpandLessIcon className="search-icon" onClick={decoratedOnClick} />
    );
  else
    return (
      <ExpandMoreIcon className="search-icon" onClick={decoratedOnClick} />
    );
}

export default function SearchBar({ getResultList, weights, setWeights }) {
  const [suggestionsList, setSuggestionsList] = useState([]);

  const updateWeights = (key, value) => {
    const aux = weights[key];
    setWeights({ ...weights, [key]: { ...aux, checked: value } });
  };

  const getSuggestionsList = (input) => {

    axios
      .get(`http://localhost:3001/book/suggest`, {
        params: {
          input: input.value,
        },
      })
      .then((res) => {
        setSuggestionsList(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onInputChange = (value) => {
    getSuggestionsList(value);
  };

  return (
    <Accordion>
      <Row>
        <Col
          sm={1}
          className="d-flex align-items-center justify-content-center"
        >
          <CustomToggle eventKey="0" />
        </Col>
        <Form.Label
          column
          sm="2"
          className="search-bar-label d-flex justify-content-start"
        >
          What are you looking for?
        </Form.Label>
        <Col sm="8">
          <Typeahead
            id="typeahead"
            options={suggestionsList}
            filterBy={() => true}
            onInputChange={(value) => onInputChange({ value })}
          />
        </Col>
        <Col>
          <Button
            className="search-button"
            onClick={() => getResultList(true, 0)}
          >
            search
          </Button>
        </Col>
      </Row>
      <Accordion.Collapse eventKey="0">
        <Row>
          <Col>
            <p>Dar pesos a: </p>
          </Col>
          {Object.keys(weights).map((item) => (
            <Col key={item}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={weights[item].checked}
                    onChange={(event) =>
                      updateWeights(item, event.target.checked)
                    }
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={weights[item].label}
              />
            </Col>
          ))}
        </Row>
      </Accordion.Collapse>
    </Accordion>
  );
}
