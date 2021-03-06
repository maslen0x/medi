import { IAppointmentsState, AppointmentsAction, AppointmentsActionTypes } from '../../types/appointments'

import updateState from '../../utils/updateState'

const initialState: IAppointmentsState = {
  appointments: [],
  appointedDates: [],
  loading: false,
}

const appointments = (state = initialState, action: AppointmentsAction): IAppointmentsState => {
  switch(action.type) {
    case AppointmentsActionTypes.SET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload
      }

    case AppointmentsActionTypes.SET_APPOINTMENTS_LOADING:
      return {
        ...state,
        loading: action.payload
      }

    case AppointmentsActionTypes.ADD_APPOINTMENT:
      return {
        ...state,
        appointments: [action.payload, ...state.appointments]
      }

    case AppointmentsActionTypes.REMOVE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment._id !== action.payload)
      }

    case AppointmentsActionTypes.UPDATE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.map(appointment => updateState(appointment, action.payload))
      }

    case AppointmentsActionTypes.SET_APPOINTED_DATES:
      return {
        ...state,
        appointedDates: action.payload
      }

    case AppointmentsActionTypes.ADD_APPOINTED_DATE:
      return {
        ...state,
        appointedDates: [action.payload, ...state.appointedDates]
      }

    default:
      return state
  }
}

export default appointments