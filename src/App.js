import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fetchContacts, selectContact } from './slices/contacts'
import { fetchLocation, selectLocation} from './slices/location'

import './App.scss';

const App = () => {
  const dispatch = useDispatch();
  const { contacts, deals, tags, totalValueCurrency, loading, errors } =  useSelector(selectContact);
  const { location, locationLoading, locationErrors } = useSelector(selectLocation); 

  useEffect(() => {
    dispatch(fetchContacts())
    dispatch(fetchLocation())
  }, [dispatch])

  const getContactsFullName = () => {
    return (
      contacts.map(contact => 
        <h4 key={contact.id}>{contact.firstName} {contact.lastName}</h4>
      )
    )
  }

  const displayDeals = () => {
    return(
      deals.map((deal, index) =>
      <h4 key={index}>{deal}</h4>
      )
    )
  }

  const displayTags = () => {
    return(
      tags.map((tag, index) => 
      <h4 key={index}>{tag.length > 1 ? removeEmptyString(tag) : tag}</h4>
      )
    )
  }

  
  const dispatchTotalValue = () => {
    return(
      totalValueCurrency.map((value, index) => 
      <h4 key={index}>{value.length > 1 ? removeEmptyString(value) : value}</h4>
      )
      )
    }
    
    const displayUserLocation = () => {
      return(
        location.map((value, index) => 
        <h4 key={index}>{value}</h4>
        )
        )
      }
      
      const removeEmptyString = (data) => {
        return data.map((item, index) => <span key={index}>{item} {index < data.length - 1 ? ',\u00A0' : ''}</span>)
    
      }

  const renderContacts = () => {
    if(loading && locationLoading) return <p> Loading Contacts Details...</p>
    if(errors && locationErrors) return <p> Error retrieving Contacts Details</p>

    return (
      <>
      <tr key={contacts.id}>
        <td id='full-name'>
      {getContactsFullName()}
        </td>
        <td>
      {dispatchTotalValue()}
        </td>
        <td>
        {displayUserLocation()}
        </td>
        <td>
      {displayDeals()}
        </td>
        <td>
      {displayTags()}
        </td>
      </tr>
      </>
    )
  }

  return (
    <div className='contacts-table'>
      <h1>Contacts Details</h1>
      <table id='contacts'>
          <tbody>
          <tr>
            <th>Contact</th>
            <th>Total Value</th>
            <th>Location</th>
            <th>Deals</th>
            <th>Tags</th>
          </tr>
            {renderContacts()}
          </tbody>
      </table>
    </div>
  );
}

export default App;
