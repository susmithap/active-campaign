import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loading: false,
  errors: false,
  contacts: [],
  deals: [],
  tags: [],
  totalValueCurrency : []
}

export const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    getContacts: state => {
      state.loading = true;
    },
    getContactsSuccess: (state, {payload}) => {
      state.contacts = payload;
      state.loading = false;
      state.errors = false;
    },
    getContactDeals: (state, {payload}) => {
      state.deals = payload;
      state.loading = false;
      state.errors= false;
    },
    getContactTags: (state, {payload}) => {
      state.tags = payload;
      state.loading = false;
      state.errors = false;
    },
    getTotalValue: (state, {payload}) => {
      state.totalValueCurrency = payload;
      state.loading = false;
      state.errors = false;
    },
    getContactsError: state => {
      state.loading = false;
      state.errors = true;
    },
  },
});

export const { getContacts, getContactsSuccess, getContactDeals, getContactTags, getTotalValue, getContactsError } = contactSlice.actions;

export const selectContact = state => state.contacts;

export default contactSlice.reducer;

export function fetchContacts() {
  return async dispatch => {
    dispatch(getContacts())
    try {
      await fetch('https://sahmed93846.api-us1.com/api/3/contacts', {
        method: 'GET',
        headers: {
          'Api-Token': 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0'
        }
      })
      .then(response => response.json())
      .then(data => {
        const links = data.contacts.map(item => item.links);
        
        //Contact Tag Fetch
        const contactTagsList = links.map(link => link.contactTags);
        let tagfetchData = contactTagsList.map(tag => {
          return fetch(tag , {
            method: 'GET',
            headers: {
              'Api-Token': 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0'
            }
          })
        })
        Promise.all(tagfetchData)
          .then(responses => responses)
          .then(responses => Promise.all(responses.map(r => r.json())))
          .then(tagList => {
            const contactTagNumId = tagList.map(tag => {
              const data = tag.contactTags.map(item => item.tag)
              return data;
            })
            const tagData = tagList.map(tag => {
            if(tag.contactTags.length > 0) {
              const tagLinksList = tag.contactTags.map(item => item.links);
              const tagLink = tagLinksList.map(link => link.tag);
              return tagLink;
            } else {
              return ''
            }
          })

          const mergedTagData = [].concat.apply([], tagData);
          const tags = [];
          let tagDatas = mergedTagData.map(item => {
            return fetch(item , {
            method: 'GET',
            headers: {
              'Api-Token': 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0'
              }
            })
          })
          Promise.all(tagDatas)
          .then(responses => responses)
          .then(responses => Promise.all(responses.map(r => r.json())))
          .then(tagsList => {
            tagsList.forEach(item => {
            tags.push(item.tag.description)
            const sortTagsData = contactTagNumId.map(item => {
              return item.length
            })
            if(tags.length === tagsList.length) {
              let tagsData = [];
              tagsData.push(...tags);

              let tagDesc =[];
              sortTagsData.map((items) => {
                if(tagsData) {
                const tags1 = tagsData.splice(0, items)
                tagDesc = Object.assign([], tagDesc);
                tagDesc.push(tags1.filter(item => item));
              }
                dispatch(getContactTags(tagDesc));
                return tagDesc
                })
              }
              });
            })
        })

        //Contact Deal and totalValue fetch
        const deals = links.map(link => link.deals);
        const dealData = [];
        const totaValue = [];
        let totalValCurr =[];
        let requests = deals.map(name => {
          return fetch(name, {
            method: 'GET',
            headers: {
              'Api-Token': 'bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0'
            }
          })
        });
        Promise.all(requests)
          .then(responses => responses)
          .then(responses => Promise.all(responses.map(r => r.json())))
          .then(dealsList => {
            dealsList.forEach(deal => {
            dealData.push(deal.deals.length);
            if(dealData.length === dealsList.length) {
              dispatch(getContactDeals(dealData))
              return dealData
            }
          })

            dealsList.forEach(item => {
              if(item.deals.length === 0) {
                item.deals = [{
                  value: "0",
                  currency: ''
                }]
              }
              item.deals.map((deals) => {
              const value = deals.value +' '+ deals.currency;
              totaValue.push(value);
              return totaValue;
            })
          })
          
          dealData.map(item => {
              const value1 = totaValue.splice(0, item === 0 ? 1: item)
                  totalValCurr = Object.assign([], totalValCurr);
                  totalValCurr.push(value1.length > 0 ? value1 : "0");
                  return totalValCurr;
                })

                dispatch(getTotalValue(totalValCurr))
            
          })
        dispatch(getContactsSuccess(data.contacts))
      })
  } catch (error) {
    dispatch(getContactsError())
  }
  }
}

