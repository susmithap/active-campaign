import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    locationLoading: false,
    locationErrors: false,
    location: []
}

export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        getLocation: state =>  {
            state.locationLoading = true
        },
        getLocationSuccess: (state, {payload}) => {
            state.location = payload;
            state.locationLoading = false;
            state.locationErrors = false;
        },
        getLocationError: state => {
            state.locationLoading = false;
            state.locationErrors = true;
        }
  }
})

export const {getLocation, getLocationError, getLocationSuccess} = locationSlice.actions;

export const selectLocation = state => state.location;

export default locationSlice.reducer;

export function fetchLocation() {
    return async dispatch => {
        dispatch(getLocation())
        try {
            await fetch('https://sahmed93846.api-us1.com/api/3/dealActivities', {
                method: 'GET',
                headers: {
                  'Api-Token': 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0'
                }
              }).then(res => res.json())
              .then(json => json.dealActivities)
              .then(dealActivity => {
                const userList = dealActivity.map(item => item.links.user);
                let userLocation =[];
                userList.map(async user => {
                    const res = await fetch(user, {
                        method: 'GET',
                        headers: {
                            'Api-Token': 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0'
                        }
                    });
                    const json = await res.json();
                    const user1 = json.user;
                    const location = user1.localZoneid;
                    userLocation = Object.assign([], userLocation);
                    userLocation.push(location);
                    dispatch(getLocationSuccess(userLocation));
                  })
                  
              })
        }catch (error) {
            dispatch(getLocationError())
        }
    }
}