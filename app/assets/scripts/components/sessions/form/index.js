import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Formik, FieldArray } from 'formik';
import get from 'lodash.get';

import App from '../../common/app';
import Constrainer from '../../../styles/constrainer';
import Form from '../../../styles/form/form';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../../styles/form/group';
import FormLabel from '../../../styles/form/label';
import FormInput from '../../../styles/form/input';
import FormSelect from '../../../styles/form/select';
import FormTextarea from '../../../styles/form/textarea';
import Button from '../../../styles/button/button';
import { addSession, updateSession } from '../../../redux/sessions';
import { generateSessionId } from '../../../utils/utils';
import { targets } from '../../../utils/targets';
import { arrows } from '../../../utils/arrows';
import { arraySort } from '../../../utils/array';
import { FormFieldset, FormFieldsetBody } from '../../../styles/form/fieldset';
import collecticon from '../../../styles/collecticons';
import FormToolbar from '../../../styles/form/toolbar';
import { FormHelper, FormHelperMessage } from '../../../styles/form/helper';
import { AppBarButton } from '../../common/app-bar';

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

    this.onFromSubmit = this.onFromSubmit.bind(this);
    this.renderAppBarActions = this.renderAppBarActions.bind(this);
  }

  getInitialFormValues (session) {
    if (session) {
      return {
        name: session.name,
        date: session.date,
        distance: session.distance,
        notes: session.notes,
        target: session.config.target,
        rounds: session.config.rounds,
        arrows: session.config.arrows
      };
    }

    return {
      name: '',
      date: new Date().toISOString().substring(0, 10),
      distance: 18,
      notes: '',
      target: targetList[0].id,
      rounds: 10,
      arrows: {
        type: arrowsList[0].id,
        ids: ['', '', '']
      }
    };
  }

  onFromSubmit (values) {
    const { addSession, updateSession, session, history } = this.props;
    const id = session.id || generateSessionId();
    const basePayload = {
      name: values.name,
      date: values.date,
      distance: values.distance,
      config: {
        rounds: values.rounds,
        arrows: {
          type: values.arrows.type,
          ids: values.arrows.ids.map((n, i) =>
            !n.trim() ? `Arrow #${i + 1}` : n
          )
        },
        target: values.target
      },
      notes: values.notes
    };

    if (session) {
      updateSession(id, basePayload);
    } else {
      addSession({
        id,
        hits: [],
        ...basePayload
      });
    }

    history.push(`/sessions/${id}`);
  }

  onFormValidate (values) {
    /* eslint-disable-next-line prefer-const */
    let errors = {};
    if (!values.name.trim()) {
      errors.name = "Session name can't be empty";
    }
    const rounds = Number(values.rounds);
    if (isNaN(rounds) || !Number.isInteger(rounds)) {
      errors.rounds = 'Rounds must be a integer number';
    }

    return errors;
  }

  renderAppBarActions (isSubmitting, submit) {
    return (
      <AppBarButton
        type='submit'
        useIcon='tick'
        disabled={isSubmitting}
        onClick={submit}
      >
        Submit
      </AppBarButton>
    );
  }

  render () {
    const { session } = this.props;

    return (
      <Formik
        initialValues={this.getInitialFormValues(session)}
        validate={this.onFormValidate}
        onSubmit={this.onFromSubmit}
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
          const hasError = (name) =>
            get(touched, name, false) && get(errors, name, false);

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

          const renderInputField = (type, path, placeholder) => (
            <FormInput
              size='large'
              type={type}
              name={path}
              onChange={handleChange}
              onBlur={handleBlur}
              value={get(values, path)}
              placeholder={placeholder}
              invalid={hasError(path)}
            />
          );

          return (
            <App
              pageTitle={session ? `Editing ${session.name}` : 'New Session'}
              backTo='/'
              renderActions={() =>
                this.renderAppBarActions(isSubmitting, handleSubmit)}
            >
              <Constrainer>
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
                      {targetList.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
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
                          {arrowsList.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>

                      <FieldArray
                        name='arrows.ids'
                        render={(arrayHelpers) => (
                          <FormGroup>
                            <FormGroupHeader>
                              <FormLabel>Arrows</FormLabel>
                              <FormToolbar>
                                <AddArrowBtn
                                  onClick={() =>
                                    arrayHelpers.push(
                                      `Arrow #${values.arrows.ids.length + 1}`
                                    )}
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
                                    {renderInputField(
                                      'text',
                                      `arrows.ids[${idx}]`,
                                      `Arrow #${idx + 1}`
                                    )}
                                  </FormGroupBody>
                                </FormGroup>
                              ))}
                            </FormGroupBody>
                          </FormGroup>
                        )}
                      />
                    </FormFieldsetBody>
                  </FormFieldset>

                  <FormGroup>
                    <FormLabel>Notes</FormLabel>
                    <FormTextarea
                      size='large'
                      name='notes'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.notes}
                      invalid={hasError('notes')}
                    />
                  </FormGroup>
                </Form>
              </Constrainer>
            </App>
          );
        }}
      </Formik>
    );
  }
}

SessionForm.propTypes = {
  history: T.object,
  session: T.object,
  addSession: T.func,
  updateSession: T.func
};

function mapStateToProps (state, props) {
  const id = props.match.params.id;
  return id
    ? {
      session: state.sessions.find((s) => s.id === id)
    }
    : {};
}

function dispatcher (dispatch) {
  return {
    addSession: (...args) => dispatch(addSession(...args)),
    updateSession: (...args) => dispatch(updateSession(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(SessionForm);
