import React, { Component } from 'react';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'

function DeleteSongModal(){

    const { store } = useContext(GlobalStoreContext);

    let songname = ""

    let index = store.markedsongfordeletion

    if (store.currentList != null){

        let song = store.currentList.songs[index]

        if (song != null){

            songname = store.currentList.songs[index].title
        }
    }

    return (
        <div class="modal" id="delete-song-modal" data-animation="slideInOutLeft">
        <div class="modal-root" id='verify-delete-song-root'>
            <div class="modal-north">
                Delete song?
            </div>                
            <div class="modal-center">
                <div class="modal-center-content">
                    Are you sure you wish to permanently remove {' '}
                            <span style={{ fontWeight: 'bold'}}>{songname}</span> from the playlist?
                </div>
            </div>
            <div class="modal-south">
                <input type="button" id="delete-song-confirm-button" class="modal-button" value='Confirm' onClick={store.deleteCall} />
                <input type="button" id="delete-song-cancel-button" class="modal-button" value='Cancel' onClick={store.hideDeleteSongModal}/>
            </div>
        </div>
    </div>
    );

}

export default DeleteSongModal