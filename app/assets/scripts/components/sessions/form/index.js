import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, FieldArray } from 'formik';
import get from 'lodash.get';

import App from '../../common/app';
import Constrainer from '../../../styles/constrainer';
import Form from '../../../styles/form/form';
import { FormGroup, FormGroupHeader, FormGroupBody } from '../../../styles/form/group';
import FormLabel from '../../../styles/form/label';
import FormInput from '../../../styles/form/input';
import FormSelect from '../../../styles/form/select';
import Button from '../../../styles/button/button';
import { addSession } from '../../../redux/sessions';
import { generateSessionId } from '../../../utils/utils';
import { targets } from '../../../utils/targets';
import { arrows } from '../../../utils/arrows';
import { arraySort } from '../../../utils/array';
import { FormFieldset, FormFieldsetBody } from '../../../styles/form/fieldset';
import collecticon from '../../../styles/collecticons';
import FormToolbar from '../../../styles/form/toolbar';
import { FormHelper, FormHelperMessage } from '../../../styles/form/helper';

const targetList = arraySort(targets, 'name');
const arrowsList = arraySort(arrows, 'name');

const fieldSetBtnAttrs = {
  variation: 'base-raised',
  size: 'small',
  hideText: true
};

const AddArrowBtn = styled(Button).attrs(fieldSetBtnAttrs)`
  &::before {
    ${collecticon('plus--small')}
  }
`;

const RemoveArrowBtn = styled(Button).attrs(fieldSetBtnAttrs)`
  &::before {
    ${collecticon('trash-bin')}
  }
`;

class SessionForm extends Component {
  constructor (props) {
    super(props);

    this.onSaveClick = this.onSaveClick.bind(this);
  }

  onSaveClick () {
    const { addSession, history } = this.props;
    const id = generateSessionId();
    addSession({
      id,
      name: 'Practice',
      date: '2019-09-07',
      distance: 18,
      config: {
        rounds: 10,
        arrows: {
          type: '6mm',
          ids: ['0001', '0002', '0003']
        },
        target: 'standard-0.5'
      },
      hits: []
    });

    history.push(`/sessions/${id}`);
  }

  getInitialFormValues () {
    return {
      name: '',
      date: (new Date()).toISOString().substring(0, 10),
      distance: 18,
      target: targetList[0].id,
      rounds: 10,
      arrows: {
        type: arrowsList[0].id,
        ids: ['Arrow #1', 'Arrow #2', 'Arrow #3']
      }
    };
  }

  onFormValidate (values) {
    /* eslint-disable-next-line prefer-const */
    let errors = {};
    if (!values.name.trim()) {
      errors.name = 'Session name can\'t be empty';
    }
    const rounds = Number(values.rounds);
    if (isNaN(rounds) || !Number.isInteger(rounds)) {
      errors.rounds = 'Rounds must be a integer number';
    }

    errors.arrows = {
      ids: values.arrows.ids.map(id => !id.trim()
        ? 'Arrow identifier can\'t be empty'
        : ''
      )
    };

    return errors;
  }

  render () {
    return (
      <App>
        <Constrainer>
          <h1>Create new Session</h1>
          <Formik
            initialValues={this.getInitialFormValues()}
            validate={this.onFormValidate}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => {
              const hasError = (name) => get(touched, name, false) && get(errors, name, false);

              const renderInputFormGroup = (label, type, path) => (
                <FormGroup>
                  <FormLabel>{label}</FormLabel>
                  {renderInputField(type, path)}
                  {hasError(path) && (
                    <FormHelper>
                      <FormHelperMessage variation='danger'>
                        {get(errors, path)}
                      </FormHelperMessage>
                    </FormHelper>
                  )}
                </FormGroup>
              );

              const renderInputField = (type, path) => (
                <FormInput
                  type={type}
                  name={path}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={get(values, path)}
                  invalid={hasError(path)}
                />
              );

              return (
                <Form onSubmit={handleSubmit}>
                  {renderInputFormGroup('Name', 'text', 'name')}
                  {renderInputFormGroup('Date', 'text', 'date')}
                  {renderInputFormGroup('Distance', 'number', 'distance')}
                  {renderInputFormGroup('Rounds', 'number', 'rounds')}
                  <FormGroup>
                    <FormLabel>Target</FormLabel>
                    <FormSelect
                      name='target'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.target}
                    >
                      {targetList.map(t => (
                        <option key={t.id}>{t.name}</option>
                      ))}
                    </FormSelect>
                  </FormGroup>

                  <FormFieldset>
                    <FormFieldsetBody>
                      <FormLabel>Quiver</FormLabel>

                      <FormGroup>
                        <FormLabel>Arrow type</FormLabel>
                        <FormSelect
                          name='arrows.type'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.arrows.type}
                        >
                          {arrowsList.map(t => (
                            <option key={t.id}>{t.name}</option>
                          ))}
                        </FormSelect>
                      </FormGroup>

                      <FieldArray
                        name='arrows.ids'
                        render={arrayHelpers => (
                          <FormGroup>
                            <FormGroupHeader>
                              <FormLabel>Arrows</FormLabel>
                              <FormToolbar>
                                <AddArrowBtn
                                  onClick={() => arrayHelpers.push(`Arrow #${values.arrows.ids.length + 1}`)}
                                >
                                  Add arrow
                                </AddArrowBtn>
                              </FormToolbar>
                            </FormGroupHeader>
                            <FormGroupBody>
                              {values.arrows.ids.map((arr, idx) => (
                                /* eslint-disable-next-line react/no-array-index-key */
                                <FormGroup key={idx}>
                                  <FormGroupHeader>
                                    <FormLabel>#{idx + 1}</FormLabel>
                                    <FormToolbar>
                                      <RemoveArrowBtn
                                        disabled={values.arrows.ids.length <= 1}
                                        onClick={() => arrayHelpers.remove(idx)}
                                      >
                                        Remove arrow
                                      </RemoveArrowBtn>
                                    </FormToolbar>
                                  </FormGroupHeader>
                                  <FormGroupBody>
                                    {renderInputField('text', `arrows.ids[${idx}]`)}
                                  </FormGroupBody>
                                </FormGroup>
                              ))}
                            </FormGroupBody>
                          </FormGroup>
                        )}
                      />

                    </FormFieldsetBody>
                  </FormFieldset>

                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    variation='primary-raised-dark'
                  >
                    Save
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Constrainer>
      </App>
    );
  }
}

SessionForm.propTypes = {
  history: T.object,
  addSession: T.func
};

function mapStateToProps (state, props) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
    addSession: (...args) => dispatch(addSession(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(SessionForm);
