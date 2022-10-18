import React, { Component } from 'react';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);

    let name = ""
    if (store.markedkeyfordeletion){
        name = store.markedkeyfordeletion.name
    }
    
        return (
            <div 
                class="modal" 
                id="delete-list-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Delete playlist?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                            Are you sure you wish to permanently delete the {' '}
                                <span style={{ fontWeight: 'bold'}}>{name}</span> playlist?
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-button" 
                                onClick={store.deleteList}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-button" 
                                onClick={store.hideDeleteListModal}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }

    export default DeleteListModal